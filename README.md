# Checkpoint Inhibitor Hypothyroidism Risk Assessment System

A web-based application for personalized dosing recommendations of checkpoint inhibitors based on hypothyroidism risk assessment using Quantitative Systems Pharmacology (QSP) modeling.

## 🔬 Overview

This application provides evidence-based dosing recommendations for checkpoint inhibitor therapy by assessing individual patient risk factors for developing hypothyroidism. The system uses QSP modeling to calculate personalized risk scores and provide tailored dosing strategies.

## ✨ Features

- **Patient Risk Assessment**: Comprehensive evaluation based on:
  - Demographics (age, sex, weight)
  - TPO antibody status
  - Performance status
  - Autoimmune disease history
  
- **Multi-Drug Support**: Dosing recommendations for:
  - Nivolumab (PD-1 inhibitor)
  - Pembrolizumab (PD-1 inhibitor)
  - Atezolizumab (PD-L1 inhibitor)
  - Durvalumab (PD-L1 inhibitor)

- **Personalized Recommendations**: 
  - Risk-stratified dosing adjustments
  - Monitoring frequency recommendations
  - Visual risk assessment dashboard

- **Interactive Interface**: 
  - Real-time risk calculation
  - Responsive design for various devices
  - Intuitive patient data entry

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely client-side

### Installation

1. Clone the repository:
```bash
git clone https://github.com/indand21/checkpoint-inhibitor-hypothyroidism-risk.git
```

2. Navigate to the project directory:
```bash
cd checkpoint-inhibitor-hypothyroidism-risk
```

3. Open `index.html` in your web browser

### Usage

1. **Enter Patient Information**:
   - Adjust age using the slider (18-90 years)
   - Select patient sex
   - Enter weight in kg
   - Select TPO antibody status
   - Choose performance status (ECOG 0-4)
   - Indicate presence of autoimmune diseases

2. **Select Checkpoint Inhibitor**:
   - Choose from available drugs
   - View drug-specific parameters

3. **View Risk Assessment**:
   - Real-time risk score calculation
   - Color-coded risk stratification
   - Personalized dosing recommendations

4. **Monitor Recommendations**:
   - Suggested monitoring frequency
   - Dose adjustment guidelines
   - Clinical considerations

## 🧪 Scientific Background

### QSP Modeling Approach

The application implements a QSP model that incorporates:

- **Pharmacokinetic Parameters**: Drug clearance, volume of distribution
- **Pharmacodynamic Factors**: Receptor binding affinity (Kd), potency
- **Patient-Specific Factors**: Age, sex, autoimmune status
- **Biomarker Integration**: TPO antibody levels

### Risk Stratification

**Low Risk (Green)**: 
- Risk score < 1.5
- Standard dosing recommended
- Monitoring every 6-8 weeks

**Moderate Risk (Yellow)**: 
- Risk score 1.5-2.5
- 25% dose reduction or extended intervals
- Monitoring every 4 weeks

**High Risk (Red)**: 
- Risk score > 2.5
- 50% dose reduction or alternative agent
- Monitoring every 2 weeks initially

## 📊 Supported Checkpoint Inhibitors

| Drug | Target | Standard Dose | Susceptibility Rate |
|------|--------|---------------|-------------------|
| Nivolumab | PD-1 | 3 mg/kg | 25% |
| Pembrolizumab | PD-1 | 2 mg/kg | 30% |
| Atezolizumab | PD-L1 | 15 mg/kg | 20% |
| Durvalumab | PD-L1 | 10 mg/kg | 18% |

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Modern CSS with responsive design
- **Icons**: Font Awesome 6.4.0
- **Architecture**: Client-side single-page application

## 📁 Project Structure

```
├── index.html          # Main application interface
├── app.js             # Core application logic and QSP calculations
├── style.css          # Styling and responsive design
└── README.md          # Project documentation
```

## 🔍 Key Components

### Risk Calculation Engine (`app.js`)
- Patient risk factor assessment
- Drug-specific parameter integration
- Real-time QSP model calculations
- Dosing recommendation algorithms

### User Interface (`index.html`)
- Interactive patient data entry forms
- Dynamic risk visualization
- Responsive recommendation display

### Styling (`style.css`)
- Modern, medical-themed design
- Mobile-responsive layout
- Accessible color schemes for risk levels

## 📚 Clinical Applications

This tool is designed to assist healthcare professionals in:

- **Oncology Practice**: Optimizing checkpoint inhibitor therapy
- **Endocrine Monitoring**: Preventing thyroid dysfunction
- **Personalized Medicine**: Tailoring treatment to individual risk profiles
- **Clinical Decision Support**: Evidence-based dosing strategies

## ⚠️ Important Disclaimers

- **For Educational/Research Purposes**: Not intended for direct clinical use without validation
- **Clinical Oversight Required**: All dosing decisions should involve qualified healthcare professionals
- **Regulatory Compliance**: Ensure local regulatory approval before clinical implementation
- **Validation Needed**: Model predictions require clinical validation in target populations

## 🤝 Contributing

We welcome contributions to improve the application:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/enhancement`)
5. Create a Pull Request

## 📖 References

- Checkpoint inhibitor-induced thyroid dysfunction literature
- QSP modeling methodologies for immunotherapy
- Clinical guidelines for thyroid monitoring during checkpoint inhibitor therapy

## 📧 Contact

**Developer**: Anand Srinivasan  
**Email**: indand21@hotmail.com  
**GitHub**: [@indand21](https://github.com/indand21)

## 📄 License

This project is available for educational and research purposes. Please ensure appropriate clinical validation and regulatory approval before any clinical application.

---

*Built with ❤️ for advancing personalized cancer care through quantitative systems pharmacology*
