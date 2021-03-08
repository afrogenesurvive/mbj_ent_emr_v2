import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import DatePicker from "react-datepicker";
import './addForms.css';

const AddVigilanceForm = (props) => {


  let placeHolders = {
      chronicIllness: {
        diabetes: {
          medication: false,
          testing: false,
          comment: '...'
        },
        hbp: {
          medication: false,
          testing: false,
          comment: '...'
        },
        dyslipidemia: {
          medication: false,
          testing: false,
          comment: '...'
        },
        cad: {
          medication: false,
          testing: false,
          comment: '...'
        }
      },
      lifestyle: {
        weight: {
          medication: false,
          testing: false,
          comment: '...'
        },
        diet: {
          medication: false,
          testing: false,
          comment: '...'
        },
        smoking: {
          medication: false,
          testing: false,
          comment: '...'
        },
        substanceAbuse: {
          medication: false,
          testing: false,
          comment: '...'
        },
        exercise: {
          medication: false,
          testing: false,
          comment: '...'
        },
        allergies: {
          medication: false,
          testing: false,
          comment: '...'
        },
        asthma: {
          medication: false,
          testing: false,
          comment: '...'
        }
      },
      screening: {
        breast: {
          medication: false,
          testing: false,
          comment: '...'
        },
        prostate: {
          medication: false,
          testing: false,
          comment: '...'
        },
        cervix: {
          medication: false,
          testing: false,
          comment: '...'
        },
        colon: {
          medication: false,
          testing: false,
          comment: '...'
        },
        dental: {
          medication: false,
          testing: false,
          comment: '...'
        }
      },
      vaccines: {
        influenza: {
          medication: false,
          testing: false,
          comment: '...'
        },
        varicella: {
          medication: false,
          testing: false,
          comment: '...'
        },
        hpv: {
          medication: false,
          testing: false,
          comment: '...'
        },
        mmr: {
          medication: false,
          testing: false,
          comment: '...'
        },
        tetanus: {
          medication: false,
          testing: false,
          comment: '...'
        },
        pneumovax: {
          medication: false,
          testing: false,
          comment: '...'
        },
        other: {
          name: '...',
          medication: false,
          testing: false,
          comment: '...'
        }
      },
      highlighted: false,
    }

  if (props.previousVigilance) {
    placeHolders = {
      chronicIllness: {
        diabetes: {
          medication: props.previousVigilance.chronicIllness.diabetes.medication,
          testing: props.previousVigilance.chronicIllness.diabetes.testing,
          comment: props.previousVigilance.chronicIllness.diabetes.comment
        },
        hbp: {
          medication: props.previousVigilance.chronicIllness.hbp.medication,
          testing: props.previousVigilance.chronicIllness.hbp.testing,
          comment: props.previousVigilance.chronicIllness.hbp.comment
        },
        dyslipidemia: {
          medication: props.previousVigilance.chronicIllness.dyslipidemia.medication,
          testing: props.previousVigilance.chronicIllness.dyslipidemia.testing,
          comment: props.previousVigilance.chronicIllness.dyslipidemia.comment
        },
        cad: {
          medication: props.previousVigilance.chronicIllness.cad.medication,
          testing: props.previousVigilance.chronicIllness.cad.testing,
          comment: props.previousVigilance.chronicIllness.cad.comment
        }
      },
      lifestyle: {
        weight: {
          medication: props.previousVigilance.lifestyle.weight.medication,
          testing: props.previousVigilance.lifestyle.weight.testing,
          comment: props.previousVigilance.lifestyle.weight.comment
        },
        diet: {
          medication: props.previousVigilance.lifestyle.diet.medication,
          testing: props.previousVigilance.lifestyle.diet.testing,
          comment: props.previousVigilance.lifestyle.diet.comment
        },
        smoking: {
          medication: props.previousVigilance.lifestyle.smoking.medication,
          testing: props.previousVigilance.lifestyle.smoking.testing,
          comment: props.previousVigilance.lifestyle.smoking.comment
        },
        substanceAbuse: {
          medication: props.previousVigilance.lifestyle.substanceAbuse.medication,
          testing: props.previousVigilance.lifestyle.substanceAbuse.testing,
          comment: props.previousVigilance.lifestyle.substanceAbuse.comment
        },
        exercise: {
          medication: props.previousVigilance.lifestyle.exercise.medication,
          testing: props.previousVigilance.lifestyle.exercise.testing,
          comment: props.previousVigilance.lifestyle.exercise.comment
        },
        allergies: {
          medication: props.previousVigilance.lifestyle.allergies.medication,
          testing: props.previousVigilance.lifestyle.allergies.testing,
          comment: props.previousVigilance.lifestyle.allergies.comment
        },
        asthma: {
          medication: props.previousVigilance.lifestyle.asthma.medication,
          testing: props.previousVigilance.lifestyle.asthma.testing,
          comment: props.previousVigilance.lifestyle.asthma.comment
        }
      },
      screening: {
        breast: {
          medication: props.previousVigilance.screening.breast.medication,
          testing: props.previousVigilance.screening.breast.testing,
          comment: props.previousVigilance.screening.breast.comment
        },
        prostate: {
          medication: props.previousVigilance.screening.prostate.medication,
          testing: props.previousVigilance.screening.prostate.testing,
          comment: props.previousVigilance.screening.prostate.comment
        },
        cervix: {
          medication: props.previousVigilance.screening.cervix.medication,
          testing: props.previousVigilance.screening.cervix.testing,
          comment: props.previousVigilance.screening.cervix.comment
        },
        colon: {
          medication: props.previousVigilance.screening.colon.medication,
          testing: props.previousVigilance.screening.colon.testing,
          comment: props.previousVigilance.screening.colon.comment
        },
        dental: {
          medication: props.previousVigilance.screening.dental.medication,
          testing: props.previousVigilance.screening.dental.testing,
          comment: props.previousVigilance.screening.dental.comment
        }
      },
      vaccines: {
        influenza: {
          medication: props.previousVigilance.vaccines.influenza.medication,
          testing: props.previousVigilance.vaccines.influenza.testing,
          comment: props.previousVigilance.vaccines.influenza.comment
        },
        varicella: {
          medication: props.previousVigilance.vaccines.varicella.medication,
          testing: props.previousVigilance.vaccines.varicella.testing,
          comment: props.previousVigilance.vaccines.varicella.comment
        },
        hpv: {
          medication: props.previousVigilance.vaccines.hpv.medication,
          testing: props.previousVigilance.vaccines.hpv.testing,
          comment: props.previousVigilance.vaccines.hpv.comment
        },
        mmr: {
          medication: props.previousVigilance.vaccines.mmr.medication,
          testing: props.previousVigilance.vaccines.mmr.testing,
          comment: props.previousVigilance.vaccines.mmr.comment
        },
        tetanus: {
          medication: props.previousVigilance.vaccines.tetanus.medication,
          testing: props.previousVigilance.vaccines.tetanus.testing,
          comment: props.previousVigilance.vaccines.tetanus.comment
        },
        pneumovax: {
          medication: props.previousVigilance.vaccines.pneumovax.medication,
          testing: props.previousVigilance.vaccines.pneumovax.testing,
          comment: props.previousVigilance.vaccines.pneumovax.comment
        },
        other: {
          name: props.previousVigilance.vaccines.other.name,
          medication: props.previousVigilance.vaccines.other.medication,
          testing: props.previousVigilance.vaccines.other.testing,
          comment: props.previousVigilance.vaccines.other.comment
        }
      },
      highlighted: false,
    }
    // console.log('placeHolders',placeHolders);
  }


  const [chronicIllnessDiabetesMedication, setChronicIllnessDiabetesMedication] = useState(placeHolders.chronicIllness.diabetes.medication)
  const handleChronicIllnessDiabetesMedicationChange = (args) => {
    setChronicIllnessDiabetesMedication(args);
  }
  const [chronicIllnessDiabetesTesting, setChronicIllnessDiabetesTesting] = useState(placeHolders.chronicIllness.diabetes.testing)
  const handleChronicIllnessDiabetesTestingChange = (args) => {
    setChronicIllnessDiabetesTesting(args);
  }

  const [chronicIllnessHbpMedication, setChronicIllnessHbpMedication] = useState(placeHolders.chronicIllness.hbp.medication)
  const handleChronicIllnessHbpMedicationChange = (args) => {
    setChronicIllnessHbpMedication(args);
  }
  const [chronicIllnessHbpTesting, setChronicIllnessHbpTesting] = useState(placeHolders.chronicIllness.hbp.testing)
  const handleChronicIllnessHbpTestingChange = (args) => {
    setChronicIllnessHbpTesting(args);
  }

  const [chronicIllnessDyslipidemiaMedication, setChronicIllnessDyslipidemiaMedication] = useState(placeHolders.chronicIllness.dyslipidemia.medication)
  const handleChronicIllnessDyslipidemiaMedicationChange = (args) => {
    setChronicIllnessDyslipidemiaMedication(args);
  }
  const [chronicIllnessDyslipidemiaTesting, setChronicIllnessDyslipidemiaTesting] = useState(placeHolders.chronicIllness.dyslipidemia.testing)
  const handleChronicIllnessDyslipidemiaTestingChange = (args) => {
    setChronicIllnessDyslipidemiaTesting(args);
  }

  const [chronicIllnessCadMedication, setChronicIllnessCadMedication] = useState(placeHolders.chronicIllness.cad.medication)
  const handleChronicIllnessCadMedicationChange = (args) => {
    setChronicIllnessCadMedication(args);
  }
  const [chronicIllnessCadTesting, setChronicIllnessCadTesting] = useState(placeHolders.chronicIllness.cad.testing)
  const handleChronicIllnessCadTestingChange = (args) => {
    setChronicIllnessCadTesting(args);
  }



  const [lifestyleWeightMedication, setLifestyleWeightMedication] = useState(placeHolders.lifestyle.weight.medication)
  const handleLifestyleWeightMedicationChange = (args) => {
    setLifestyleWeightMedication(args);
  }
  const [lifestyleWeightTesting, setLifestyleWeightTesting] = useState(placeHolders.lifestyle.weight.testing)
  const handleLifestyleWeightTestingChange = (args) => {
    setLifestyleWeightTesting(args);
  }

  const [lifestyleDietMedication, setLifestyleDietMedication] = useState(placeHolders.lifestyle.diet.medication)
  const handleLifestyleDietMedicationChange = (args) => {
    setLifestyleDietMedication(args);
  }
  const [lifestyleDietTesting, setLifestyleDietTesting] = useState(placeHolders.lifestyle.diet.testing)
  const handleLifestyleDietTestingChange = (args) => {
    setLifestyleDietTesting(args);
  }

  const [lifestyleSmokingMedication, setLifestyleSmokingMedication] = useState(placeHolders.lifestyle.smoking.medication)
  const handleLifestyleSmokingMedicationChange = (args) => {
    setLifestyleSmokingMedication(args);
  }
  const [lifestyleSmokingTesting, setLifestyleSmokingTesting] = useState(placeHolders.lifestyle.smoking.testing)
  const handleLifestyleSmokingTestingChange = (args) => {
    setLifestyleSmokingTesting(args);
  }

  const [lifestyleSubstanceAbuseMedication, setLifestyleSubstanceAbuseMedication] = useState(placeHolders.lifestyle.substanceAbuse.medication)
  const handleLifestyleSubstanceAbuseMedicationChange = (args) => {
    setLifestyleSubstanceAbuseMedication(args);
  }
  const [lifestyleSubstanceAbuseTesting, setLifestyleSubstanceAbuseTesting] = useState(placeHolders.lifestyle.substanceAbuse.testing)
  const handleLifestyleSubstanceAbuseTestingChange = (args) => {
    setLifestyleSubstanceAbuseTesting(args);
  }

  const [lifestyleExerciseMedication, setLifestyleExerciseMedication] = useState(placeHolders.lifestyle.exercise.medication)
  const handleLifestyleExerciseMedicationChange = (args) => {
    setLifestyleExerciseMedication(args);
  }
  const [lifestyleExerciseTesting, setLifestyleExerciseTesting] = useState(placeHolders.lifestyle.exercise.testing)
  const handleLifestyleExerciseTestingChange = (args) => {
    setLifestyleExerciseTesting(args);
  }

  const [lifestyleAllergiesMedication, setLifestyleAllergiesMedication] = useState(placeHolders.lifestyle.allergies.medication)
  const handleLifestyleAllergiesMedicationChange = (args) => {
    setLifestyleAllergiesMedication(args);
  }
  const [lifestyleAllergiesTesting, setLifestyleAllergiesTesting] = useState(placeHolders.lifestyle.allergies.testing)
  const handleLifestyleAllergiesTestingChange = (args) => {
    setLifestyleAllergiesTesting(args);
  }

  const [lifestyleAsthmaMedication, setLifestyleAsthmaMedication] = useState(placeHolders.lifestyle.asthma.medication)
  const handleLifestyleAsthmaMedicationChange = (args) => {
    setLifestyleAsthmaMedication(args);
  }
  const [lifestyleAsthmaTesting, setLifestyleAsthmaTesting] = useState(placeHolders.lifestyle.asthma.testing)
  const handleLifestyleAsthmaTestingChange = (args) => {
    setLifestyleAsthmaTesting(args);
  }


  const [screeningBreastMedication, setScreeningBreastMedication] = useState(placeHolders.screening.breast.medication)
  const handleScreeningBreastMedicationChange = (args) => {
    setScreeningBreastMedication(args);
  }
  const [screeningBreastTesting, setScreeningBreastTesting] = useState(placeHolders.screening.breast.testing)
  const handleScreeningBreastTestingChange = (args) => {
    setScreeningBreastTesting(args);
  }

  const [screeningProstateMedication, setScreeningProstateMedication] = useState(placeHolders.screening.prostate.medication)
  const handleScreeningProstateMedicationChange = (args) => {
    setScreeningProstateMedication(args);
  }
  const [screeningProstateTesting, setScreeningProstateTesting] = useState(placeHolders.screening.prostate.testing)
  const handleScreeningProstateTestingChange = (args) => {
    setScreeningProstateTesting(args);
  }

  const [screeningCervixMedication, setScreeningCervixMedication] = useState(placeHolders.screening.cervix.medication)
  const handleScreeningCervixMedicationChange = (args) => {
    setScreeningCervixMedication(args);
  }
  const [screeningCervixTesting, setScreeningCervixTesting] = useState(placeHolders.screening.cervix.testing)
  const handleScreeningCervixTestingChange = (args) => {
    setScreeningCervixTesting(args);
  }

  const [screeningColonMedication, setScreeningColonMedication] = useState(placeHolders.screening.colon.medication)
  const handleScreeningColonMedicationChange = (args) => {
    setScreeningColonMedication(args);
  }
  const [screeningColonTesting, setScreeningColonTesting] = useState(placeHolders.screening.colon.testing)
  const handleScreeningColonTestingChange = (args) => {
    setScreeningColonTesting(args);
  }

  const [screeningDentalMedication, setScreeningDentalMedication] = useState(placeHolders.screening.dental.medication)
  const handleScreeningDentalMedicationChange = (args) => {
    setScreeningDentalMedication(args);
  }
  const [screeningDentalTesting, setScreeningDentalTesting] = useState(placeHolders.screening.dental.testing)
  const handleScreeningDentalTestingChange = (args) => {
    setScreeningDentalTesting(args);
  }


  const [vaccinesInfluenzaMedication, setVaccinesInfluenzaMedication] = useState(placeHolders.vaccines.influenza.medication)
  const handleVaccinesInfluenzaMedicationChange = (args) => {
    setVaccinesInfluenzaMedication(args);
  }
  const [vaccinesInfluenzaTesting, setVaccinesInfluenzaTesting] = useState(placeHolders.vaccines.influenza.testing)
  const handleVaccinesInfluenzaTestingChange = (args) => {
    setVaccinesInfluenzaTesting(args);
  }

  const [vaccinesVaricellaMedication, setVaccinesVaricellaMedication] = useState(placeHolders.vaccines.varicella.medication)
  const handleVaccinesVaricellaMedicationChange = (args) => {
    setVaccinesVaricellaMedication(args);
  }
  const [vaccinesVaricellaTesting, setVaccinesVaricellaTesting] = useState(placeHolders.vaccines.varicella.testing)
  const handleVaccinesVaricellaTestingChange = (args) => {
    setVaccinesVaricellaTesting(args);
  }

  const [vaccinesHpvMedication, setVaccinesHpvMedication] = useState(placeHolders.vaccines.hpv.medication)
  const handleVaccinesHpvMedicationChange = (args) => {
    setVaccinesHpvMedication(args);
  }
  const [vaccinesHpvTesting, setVaccinesHpvTesting] = useState(placeHolders.vaccines.hpv.testing)
  const handleVaccinesHpvTestingChange = (args) => {
    setVaccinesHpvTesting(args);
  }

  const [vaccinesMmrMedication, setVaccinesMmrMedication] = useState(placeHolders.vaccines.mmr.medication)
  const handleVaccinesMmrMedicationChange = (args) => {
    setVaccinesMmrMedication(args);
  }
  const [vaccinesMmrTesting, setVaccinesMmrTesting] = useState(placeHolders.vaccines.mmr.testing)
  const handleVaccinesMmrTestingChange = (args) => {
    setVaccinesMmrTesting(args);
  }

  const [vaccinesTetanusMedication, setVaccinesTetanusMedication] = useState(placeHolders.vaccines.tetanus.medication)
  const handleVaccinesTetanusMedicationChange = (args) => {
    setVaccinesTetanusMedication(args);
  }
  const [vaccinesTetanusTesting, setVaccinesTetanusTesting] = useState(placeHolders.vaccines.tetanus.testing)
  const handleVaccinesTetanusTestingChange = (args) => {
    setVaccinesTetanusTesting(args);
  }

  const [vaccinesPneumovaxMedication, setVaccinesPneumovaxMedication] = useState(placeHolders.vaccines.pneumovax.medication)
  const handleVaccinesPneumovaxMedicationChange = (args) => {
    setVaccinesPneumovaxMedication(args);
  }
  const [vaccinesPneumovaxTesting, setVaccinesPneumovaxTesting] = useState(placeHolders.vaccines.pneumovax.testing)
  const handleVaccinesPneumovaxTestingChange = (args) => {
    setVaccinesPneumovaxTesting(args);
  }

  const [vaccinesOtherMedication, setVaccinesOtherMedication] = useState(placeHolders.vaccines.other.medication)
  const handleVaccinesOtherMedicationChange = (args) => {
    setVaccinesOtherMedication(args);
  }
  const [vaccinesOtherTesting, setVaccinesOtherTesting] = useState(placeHolders.vaccines.other.testing)
  const handleVaccinesOtherTestingChange = (args) => {
    setVaccinesOtherTesting(args);
  }


return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousVigilance && (
      <h3>Update Vigilance</h3>
    )}
    {!props.previousVigilance && (
      <h3>Add Vigilance</h3>
    )}

    <div className="formDivider1">
    <h4>Chronic Illness:</h4>
    <p className="underlined">Diabetes</p>
    <Form.Row>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessDiabetesMedication} onChange={(e) => {handleChronicIllnessDiabetesMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessDiabetesTesting} onChange={(e) => {handleChronicIllnessDiabetesTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.chronicIllness.diabetes.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">HBP</p>
    <Form.Row>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessHbpMedication} onChange={(e) => {handleChronicIllnessHbpMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessHbpTesting} onChange={(e) => {handleChronicIllnessHbpTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.chronicIllness.hbp.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Dyslipidemia</p>
    <Form.Row>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessDyslipidemiaMedication} onChange={(e) => {handleChronicIllnessDyslipidemiaMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessDyslipidemiaTesting} onChange={(e) => {handleChronicIllnessDyslipidemiaTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.chronicIllness.dyslipidemia.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Cad</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessCadMedication} onChange={(e) => {handleChronicIllnessCadMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={chronicIllnessCadTesting} onChange={(e) => {handleChronicIllnessCadTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.chronicIllness.cad.comment}/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider2">
    <h4>Lifestyle:</h4>
    <p className="underlined">Weight</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleWeightMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleWeightMedication} onChange={(e) => {handleLifestyleWeightMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleWeightTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleWeightTesting} onChange={(e) => {handleLifestyleWeightTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleWeightComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.weight.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Diet</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleDietMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleDietMedication} onChange={(e) => {handleLifestyleDietMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleDietTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleDietTesting} onChange={(e) => {handleLifestyleDietTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleDietComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.diet.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Smoking</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleSmokingMedication} onChange={(e) => {handleLifestyleSmokingMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleSmokingTesting} onChange={(e) => {handleLifestyleSmokingTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.smoking.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">SubstanceAbuse</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleSubstanceAbuseMedication} onChange={(e) => {handleLifestyleSubstanceAbuseMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleSubstanceAbuseTesting} onChange={(e) => {handleLifestyleSubstanceAbuseTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.substanceAbuse.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Exercise</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleExerciseMedication} onChange={(e) => {handleLifestyleExerciseMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleExerciseTesting} onChange={(e) => {handleLifestyleExerciseTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.exercise.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Allergies</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleAllergiesMedication} onChange={(e) => {handleLifestyleAllergiesMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleAllergiesTesting} onChange={(e) => {handleLifestyleAllergiesTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.allergies.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Asthma</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleAsthmaMedication} onChange={(e) => {handleLifestyleAsthmaMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={lifestyleAsthmaTesting} onChange={(e) => {handleLifestyleAsthmaTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.lifestyle.asthma.comment}/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider3">
    <h4>Screening:</h4>
    <p className="underlined">Breast</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningBreastMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningBreastMedication} onChange={(e) => {handleScreeningBreastMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningBreastTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningBreastTesting} onChange={(e) => {handleScreeningBreastTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningBreastComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.screening.breast.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Prostate</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningProstateMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningProstateMedication} onChange={(e) => {handleScreeningProstateMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningProstateTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningProstateTesting} onChange={(e) => {handleScreeningProstateTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningProstateComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.screening.prostate.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Cervix</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningCervixMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningCervixMedication} onChange={(e) => {handleScreeningCervixMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningCervixTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningCervixTesting} onChange={(e) => {handleScreeningCervixTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningCervixComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.screening.cervix.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Colon</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningColonMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningColonMedication} onChange={(e) => {handleScreeningColonMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningColonTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningColonTesting} onChange={(e) => {handleScreeningColonTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningColonComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.screening.colon.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Dental</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningDentalMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningDentalMedication} onChange={(e) => {handleScreeningDentalMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningDentalTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={screeningDentalTesting} onChange={(e) => {handleScreeningDentalTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningDentalComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.screening.dental.comment}/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider1">
    <h4>Vaccines</h4>
    <p className="underlined">Influenza</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesInfluenzaMedication} onChange={(e) => {handleVaccinesInfluenzaMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesInfluenzaTesting} onChange={(e) => {handleVaccinesInfluenzaTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.influenza.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Varicella</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesVaricellaMedication} onChange={(e) => {handleVaccinesVaricellaMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesVaricellaTesting} onChange={(e) => {handleVaccinesVaricellaTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.varicella.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Hpv</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesHpvMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesHpvMedication} onChange={(e) => {handleVaccinesHpvMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesHpvTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesHpvTesting} onChange={(e) => {handleVaccinesHpvTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesHpvComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.hpv.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Mmr</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesMmrMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesMmrMedication} onChange={(e) => {handleVaccinesMmrMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesMmrTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesMmrTesting} onChange={(e) => {handleVaccinesMmrTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesMmrComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.mmr.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Tetanus</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesTetanusMedication} onChange={(e) => {handleVaccinesTetanusMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesTetanusTesting} onChange={(e) => {handleVaccinesTetanusTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.tetanus.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Pneumovax</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesPneumovaxMedication} onChange={(e) => {handleVaccinesPneumovaxMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesPneumovaxTesting} onChange={(e) => {handleVaccinesPneumovaxTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.pneumovax.comment}/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Other</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesOtherName">
        <Form.Label className="formLabel">Name</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.other.name}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesOtherMedication} onChange={(e) => {handleVaccinesOtherMedicationChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={vaccinesOtherTesting} onChange={(e) => {handleVaccinesOtherTestingChange(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.vaccines.other.comment}/>
      </Form.Group>
    </Form.Row>
    </div>


    <Form.Row className="formBtnRow">

      {props.previousVigilance && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousVigilance && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddVigilanceForm;
