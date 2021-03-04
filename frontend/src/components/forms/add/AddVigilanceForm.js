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
    console.log('placeHolders',placeHolders);
  }


  const [checkboxValues, setCheckboxValue] = useState({
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
    }
  })
  const handleCheckboxValueChange = (args) => {

    let setObject = checkboxValues;
    let fieldSplit = args.field.split(".");
    console.log('pre',setObject);
    console.log('pre2',setObject[fieldSplit[0]][fieldSplit[1]][fieldSplit[2]]);
    setObject[fieldSplit[0]][fieldSplit[1]][fieldSplit[2]] = args.value;
    console.log('post',setObject);
    console.log('post2',setObject[fieldSplit[0]][fieldSplit[1]][fieldSplit[2]]);

    setCheckboxValue(setObject)
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
        <Form.Control type="checkbox" checked={checkboxValues.chronicIllness.diabetes.medication} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.diabetes.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={checkboxValues.chronicIllness.diabetes.testing} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.diabetes.testing',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" checked={checkboxValues.chronicIllness.hbp.medication} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.hbp.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" checked={checkboxValues.chronicIllness.hbp.testing} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.hbp.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.chronicIllness.dyslipidemia.medication} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.dyslipidemia.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.chronicIllness.dyslipidemia.testing} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.dyslipidemia.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.chronicIllness.cad.medication} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.cad.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.chronicIllness.cad.testing} onChange={(e) => {handleCheckboxValueChange({field:'chronicIllness.cad.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.weight.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.weight.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleWeightTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.weight.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.weight.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.diet.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.diet.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleDietTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.diet.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.diet.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.smoking.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.smoking.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.smoking.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.smoking.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.substanceAbuse.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.substanceAbuse.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.substanceAbuse.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.substanceAbuse.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.exercise.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.exercise.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.exercise.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.exercise.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.allergies.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.allergies.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.allergies.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.allergies.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.asthma.medication} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.asthma.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.lifestyle.asthma.testing} onChange={(e) => {handleCheckboxValueChange({field:'lifestyle.asthma.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.screening.breast.medication} onChange={(e) => {handleCheckboxValueChange({field:'screening.breast.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningBreastTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.screening.breast.testing} onChange={(e) => {handleCheckboxValueChange({field:'screening.breast.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.screening.prostate.medication} onChange={(e) => {handleCheckboxValueChange({field:'screening.prostate.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningProstateTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.screening.prostate.testing} onChange={(e) => {handleCheckboxValueChange({field:'screening.prostate.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.screening.cervix.medication} onChange={(e) => {handleCheckboxValueChange({field:'screening.cervix.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningCervixTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.screening.cervix.testing} onChange={(e) => {handleCheckboxValueChange({field:'screening.cervix.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.screening.colon.medication} onChange={(e) => {handleCheckboxValueChange({field:'screening.colon.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningColonTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.screening.colon.testing} onChange={(e) => {handleCheckboxValueChange({field:'screening.colon.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.screening.dental.medication} onChange={(e) => {handleCheckboxValueChange({field:'screening.dental.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningDentalTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.screening.dental.testing} onChange={(e) => {handleCheckboxValueChange({field:'screening.dental.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.influenza.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.influenza.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.influenza.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.influenza.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.varicella.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.varicella.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.varicella.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.varicella.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.hpv.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.hpv.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesHpvTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.hpv.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.hpv.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.mmr.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.mmr.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesMmrTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.mmr.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.mmr.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.tetanus.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.tetanus.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.tetanus.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.tetanus.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.pneumovax.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.pneumovax.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.pneumovax.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.pneumovax.medication',value:e.target.checked})}}/>
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
        <Form.Control type="checkbox" value={checkboxValues.vaccines.other.medication} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.other.medication',value:e.target.checked})}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" value={checkboxValues.vaccines.other.testing} onChange={(e) => {handleCheckboxValueChange({field:'vaccines.other.medication',value:e.target.checked})}}/>
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
