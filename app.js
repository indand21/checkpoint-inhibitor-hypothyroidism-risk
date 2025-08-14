// Application data from JSON
const appData = {
  "drugs": {
    "nivolumab": {
      "name": "Nivolumab",
      "target": "PD-1",
      "susceptibility_rate": 25.0,
      "activation_threshold": 8000.0,
      "standard_dose_mg_kg": 3.0,
      "clearance": 0.2,
      "volume": 6.0,
      "kd": 2.6,
      "potency": 1.0
    },
    "pembrolizumab": {
      "name": "Pembrolizumab", 
      "target": "PD-1",
      "susceptibility_rate": 30.0,
      "activation_threshold": 6000.0,
      "standard_dose_mg_kg": 2.0,
      "clearance": 0.22,
      "volume": 6.0,
      "kd": 3.2,
      "potency": 0.85
    },
    "atezolizumab": {
      "name": "Atezolizumab",
      "target": "PD-L1", 
      "susceptibility_rate": 20.0,
      "activation_threshold": 45000.0,
      "standard_dose_mg_kg": 15.0,
      "clearance": 0.25,
      "volume": 6.5,
      "kd": 0.8,
      "potency": 0.25
    },
    "durvalumab": {
      "name": "Durvalumab",
      "target": "PD-L1",
      "susceptibility_rate": 18.0, 
      "activation_threshold": 35000.0,
      "standard_dose_mg_kg": 10.0,
      "clearance": 0.24,
      "volume": 6.2,
      "kd": 1.0,
      "potency": 0.30
    }
  },
  "risk_factors": {
    "damage_susceptibility": {
      "low": 0.7,
      "moderate": 1.2,
      "high": 1.8
    },
    "age_factor": {
      "young": 0.8,
      "middle": 1.0,
      "elderly": 1.3
    },
    "sex_factor": {
      "male": 0.8,
      "female": 1.2
    },
    "tpo_factor": {
      "negative": 1.0,
      "low_positive": 1.3,
      "high_positive": 1.8
    }
  },
  "dosing_recommendations": {
    "low_risk": {
      "dose_reduction": 0,
      "monitoring_frequency": "Every 6-8 weeks",
      "description": "Standard dosing acceptable"
    },
    "moderate_risk": {
      "dose_reduction": 25,
      "monitoring_frequency": "Every 4 weeks", 
      "description": "25% dose reduction or extended intervals"
    },
    "high_risk": {
      "dose_reduction": 50,
      "monitoring_frequency": "Every 2 weeks initially",
      "description": "50% dose reduction or switch to lower-risk agent"
    }
  }
};

// Application state
let currentPatient = {
  age: 45,
  sex: 'male',
  weight: 70,
  tpoStatus: 'negative',
  performanceStatus: 0,
  hasAutoimmune: false
};

let currentRisk = {
  score: 1.0,
  category: 'moderate'
};

// DOM elements
const ageSlider = document.getElementById('age-slider');
const ageValue = document.getElementById('age-value');
const sexRadios = document.querySelectorAll('input[name="sex"]');
const weightInput = document.getElementById('weight');
const tpoSelect = document.getElementById('tpo-status');
const performanceSelect = document.getElementById('performance-status');
const autoimmuneCheckbox = document.getElementById('autoimmune');
const riskScore = document.getElementById('risk-score');
const riskCategory = document.getElementById('risk-category');
const riskGaugeFill = document.getElementById('risk-gauge-fill');
const drugCards = document.getElementById('drug-cards');
const dosingTableBody = document.getElementById('dosing-table-body');
const monitoringFrequency = document.getElementById('monitoring-frequency');
const toggleScientific = document.getElementById('toggle-scientific');
const scientificContent = document.getElementById('scientific-content');
const exportBtn = document.getElementById('export-btn');
const resetBtn = document.getElementById('reset-btn');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  calculateRisk();
  updateDisplay();
});

// Event listeners
function setupEventListeners() {
  ageSlider.addEventListener('input', function() {
    currentPatient.age = parseInt(this.value);
    ageValue.textContent = this.value;
    calculateRisk();
    updateDisplay();
  });

  sexRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      currentPatient.sex = this.value;
      calculateRisk();
      updateDisplay();
    });
  });

  weightInput.addEventListener('input', function() {
    const weight = parseFloat(this.value);
    if (weight && weight >= 40 && weight <= 150) {
      currentPatient.weight = weight;
      calculateRisk();
      updateDisplay();
    }
  });

  tpoSelect.addEventListener('change', function() {
    currentPatient.tpoStatus = this.value;
    calculateRisk();
    updateDisplay();
  });

  performanceSelect.addEventListener('change', function() {
    currentPatient.performanceStatus = parseInt(this.value);
    calculateRisk();
    updateDisplay();
  });

  autoimmuneCheckbox.addEventListener('change', function() {
    currentPatient.hasAutoimmune = this.checked;
    calculateRisk();
    updateDisplay();
  });

  toggleScientific.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    scientificContent.classList.toggle('expanded');
  });

  exportBtn.addEventListener('click', exportReport);
  resetBtn.addEventListener('click', resetForm);
}

// Risk calculation
function calculateRisk() {
  let baseSusceptibility = 1.0;
  
  // Age factor
  if (currentPatient.age >= 65) {
    baseSusceptibility *= appData.risk_factors.age_factor.elderly;
  } else if (currentPatient.age >= 45) {
    baseSusceptibility *= appData.risk_factors.age_factor.middle;
  } else {
    baseSusceptibility *= appData.risk_factors.age_factor.young;
  }
  
  // Sex factor
  baseSusceptibility *= appData.risk_factors.sex_factor[currentPatient.sex];
  
  // TPO antibody factor
  baseSusceptibility *= appData.risk_factors.tpo_factor[currentPatient.tpoStatus];
  
  // Autoimmune history factor
  if (currentPatient.hasAutoimmune) {
    baseSusceptibility *= 1.2;
  }
  
  // Performance status factor
  if (currentPatient.performanceStatus >= 2) {
    baseSusceptibility *= 1.1;
  }
  
  currentRisk.score = Math.round(baseSusceptibility * 100) / 100;
  
  // Determine risk category
  if (currentRisk.score < 1.0) {
    currentRisk.category = 'low_risk';
  } else if (currentRisk.score <= 1.5) {
    currentRisk.category = 'moderate_risk';
  } else {
    currentRisk.category = 'high_risk';
  }
}

// Calculate drug-specific risks and recommendations
function calculateDrugRecommendations() {
  const drugs = Object.keys(appData.drugs).map(key => {
    const drug = appData.drugs[key];
    const drugRisk = (drug.susceptibility_rate / 100) * currentRisk.score;
    
    return {
      key: key,
      ...drug,
      calculated_risk: Math.round(drugRisk * 1000) / 10, // Convert to percentage with 1 decimal
      safety_score: 1 / drugRisk // Lower risk = higher safety score
    };
  });
  
  // Sort by safety (lowest risk first)
  return drugs.sort((a, b) => a.calculated_risk - b.calculated_risk);
}

// Update display
function updateDisplay() {
  updateRiskDisplay();
  updateDrugCards();
  updateDosingTable();
  updateMonitoring();
}

function updateRiskDisplay() {
  riskScore.textContent = currentRisk.score;
  
  // Update risk category badge
  const categoryElement = riskCategory;
  const categoryDisplay = currentRisk.category.replace('_risk', '');
  categoryElement.textContent = categoryDisplay.charAt(0).toUpperCase() + categoryDisplay.slice(1);
  categoryElement.className = 'category-badge';
  
  // Update gauge fill and colors
  const gaugeElement = riskGaugeFill;
  let fillWidth, color;
  
  switch(currentRisk.category) {
    case 'low_risk':
      fillWidth = '25%';
      color = '#90EE90';
      break;
    case 'moderate_risk':
      fillWidth = '50%';
      color = '#FFD700';
      break;
    case 'high_risk':
      fillWidth = '75%';
      color = '#FF6B6B';
      break;
  }
  
  gaugeElement.style.width = fillWidth;
  gaugeElement.style.background = color;
  categoryElement.style.background = color;
}

function updateDrugCards() {
  const drugRecommendations = calculateDrugRecommendations();
  
  drugCards.innerHTML = '';
  
  drugRecommendations.forEach((drug, index) => {
    const isRecommended = index === 0;
    
    const cardElement = document.createElement('div');
    cardElement.className = `drug-card ${isRecommended ? 'recommended' : ''}`;
    
    cardElement.innerHTML = `
      <div class="drug-header">
        <div>
          <div class="drug-name">${drug.name}</div>
          <div class="drug-target">${drug.target}</div>
        </div>
        <div class="drug-risk">${drug.calculated_risk}%</div>
      </div>
      <div class="drug-details">
        <div class="drug-detail">
          <span class="detail-label">Population Risk</span>
          <span class="detail-value">${drug.susceptibility_rate}%</span>
        </div>
        <div class="drug-detail">
          <span class="detail-label">Standard Dose</span>
          <span class="detail-value">${drug.standard_dose_mg_kg} mg/kg</span>
        </div>
        <div class="drug-detail">
          <span class="detail-label">Clearance</span>
          <span class="detail-value">${drug.clearance} L/h</span>
        </div>
        <div class="drug-detail">
          <span class="detail-label">Volume</span>
          <span class="detail-value">${drug.volume} L</span>
        </div>
      </div>
    `;
    
    drugCards.appendChild(cardElement);
  });
}

function updateDosingTable() {
  const drugRecommendations = calculateDrugRecommendations();
  const riskRecommendation = appData.dosing_recommendations[currentRisk.category];
  
  // Clear existing table content
  dosingTableBody.innerHTML = '';
  
  console.log('Updating dosing table with drugs:', drugRecommendations.length);
  console.log('Risk recommendation:', riskRecommendation);
  console.log('Patient weight:', currentPatient.weight);
  
  drugRecommendations.forEach(drug => {
    const standardDose = drug.standard_dose_mg_kg * currentPatient.weight;
    const reductionPercent = riskRecommendation.dose_reduction;
    const personalizedDose = standardDose * (1 - reductionPercent / 100);
    
    console.log(`Processing ${drug.name}: standard=${standardDose}, personalized=${personalizedDose}, reduction=${reductionPercent}%`);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${drug.name}</strong></td>
      <td>${standardDose.toFixed(0)} mg (${drug.standard_dose_mg_kg} mg/kg)</td>
      <td>${personalizedDose.toFixed(0)} mg</td>
      <td><span class="reduction-badge">${reductionPercent}%</span></td>
      <td>${riskRecommendation.description}</td>
    `;
    
    dosingTableBody.appendChild(row);
  });
  
  console.log('Table rows added:', dosingTableBody.children.length);
}

function updateMonitoring() {
  const riskRecommendation = appData.dosing_recommendations[currentRisk.category];
  monitoringFrequency.textContent = riskRecommendation.monitoring_frequency;
}

// Export functionality
function exportReport() {
  const drugRecommendations = calculateDrugRecommendations();
  const riskRecommendation = appData.dosing_recommendations[currentRisk.category];
  
  let reportContent = `
CHECKPOINT INHIBITOR PERSONALIZED DOSING REPORT
=============================================

Patient Information:
- Age: ${currentPatient.age} years
- Sex: ${currentPatient.sex}
- Weight: ${currentPatient.weight} kg
- TPO Antibody Status: ${currentPatient.tpoStatus}
- Performance Status: ${currentPatient.performanceStatus}
- Prior Autoimmune Disease: ${currentPatient.hasAutoimmune ? 'Yes' : 'No'}

Risk Assessment:
- Risk Score: ${currentRisk.score}
- Risk Category: ${currentRisk.category.replace('_risk', '').toUpperCase()}

Drug Recommendations (Ranked by Safety):
`;

  drugRecommendations.forEach((drug, index) => {
    const standardDose = drug.standard_dose_mg_kg * currentPatient.weight;
    const personalizedDose = standardDose * (1 - riskRecommendation.dose_reduction / 100);
    
    reportContent += `
${index + 1}. ${drug.name} (${drug.target})
   - Population Risk: ${drug.susceptibility_rate}%
   - Patient Risk: ${drug.calculated_risk}%
   - Standard Dose: ${standardDose.toFixed(0)} mg
   - Personalized Dose: ${personalizedDose.toFixed(0)} mg
   - Dose Reduction: ${riskRecommendation.dose_reduction}%
`;
  });

  reportContent += `
Monitoring Recommendations:
- TSH Monitoring: ${riskRecommendation.monitoring_frequency}
- Dosing Strategy: ${riskRecommendation.description}

Warning Signs to Monitor:
- Persistent fatigue
- Weight gain >5% baseline
- Cold intolerance
- Bradycardia
- Depression/mood changes

Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
`;

  // Create and download the report
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dosing-report-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  // Show success message
  showNotification('Report exported successfully!', 'success');
}

// Reset functionality
function resetForm() {
  currentPatient = {
    age: 45,
    sex: 'male',
    weight: 70,
    tpoStatus: 'negative',
    performanceStatus: 0,
    hasAutoimmune: false
  };
  
  // Reset form elements
  ageSlider.value = 45;
  ageValue.textContent = '45';
  document.querySelector('input[name="sex"][value="male"]').checked = true;
  weightInput.value = 70;
  tpoSelect.value = 'negative';
  performanceSelect.value = '0';
  autoimmuneCheckbox.checked = false;
  
  calculateRisk();
  updateDisplay();
  
  showNotification('Form reset successfully!', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--sandal-terracotta);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function getNotificationIcon(type) {
  switch(type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-info-circle';
  }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Add tooltips for medical terms
function addTooltips() {
  const tooltipElements = [
    { selector: '[data-tooltip]', content: 'tooltip' }
  ];
  
  // Simple tooltip implementation
  document.addEventListener('mouseover', function(e) {
    if (e.target.hasAttribute('data-tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = e.target.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: absolute;
        background: var(--sandal-deep);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
      
      e.target._tooltip = tooltip;
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    if (e.target._tooltip) {
      document.body.removeChild(e.target._tooltip);
      delete e.target._tooltip;
    }
  });
}

// Initialize tooltips
addTooltips();

// Add responsive behavior for better mobile experience
function handleResponsiveLayout() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Adjust drug cards for mobile
    const cards = document.querySelectorAll('.drug-card');
    cards.forEach(card => {
      card.style.marginBottom = '16px';
    });
    
    // Adjust table for mobile
    const table = document.querySelector('.dosing-table');
    if (table) {
      table.style.fontSize = '14px';
    }
  }
}

window.addEventListener('resize', handleResponsiveLayout);
handleResponsiveLayout();