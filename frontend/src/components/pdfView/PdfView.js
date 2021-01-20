import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import loadingGif from '../../assets/loading.gif';
import letterHead from '../../assets/letterhead2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt,
  faBan,
  faCheckSquare,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

import "./pdfview.css"


const styles = StyleSheet.create({
  body: {
    paddingTop: 25,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Times-Roman'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Times-Roman'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  textClose: {
    margin: 9,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  textCenter: {
    margin: 12,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Times-Roman'
  },
  textCenterClose: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Times-Roman'
  },
  textRight: {
    margin: 12,
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'Times-Roman'
  },
  textLeft: {
    margin: 12,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Times-Roman'
  },
  image: {

  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },

  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }

});



const PdfView = (props) => {

return (
  <div className="pdfViewBg">
    <div className="pdfView">

    <Col className="pdfViewClose">
    <Button variant="outline-danger" id="pdfViewCloseBtn" size="sm" class="centered_btn" onClick={props.close}>X</Button>
    </Col>
    <Col className="pdfViewCol">
    <h3>Document Generator</h3>
    </Col>

    <PDFViewer className="viewer">

    {props.pdfViewData.type === 'test' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.title}>{props.pdfViewData.type}</Text>
          <Text style={styles.author}>Miguel de Cervantes</Text>


          <Text style={styles.subtitle}>
            Patient name: {props.patient.name}
          </Text>
          <Text style={styles.text}>
            En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha
            mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga
            antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que
            carnero, salpicón las más noches, duelos y quebrantos los sábados,
            lentejas los viernes, algún palomino de añadidura los domingos,
            consumían las tres partes de su hacienda. El resto della concluían sayo
            de velarte, calzas de velludo para las fiestas con sus pantuflos de lo
            mismo, los días de entre semana se honraba con su vellori de lo más
            fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina
            que no llegaba a los veinte, y un mozo de campo y plaza, que así
            ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro
            hidalgo con los cincuenta años, era de complexión recia, seco de carnes,
            enjuto de rostro; gran madrugador y amigo de la caza. Quieren decir que
            tenía el sobrenombre de Quijada o Quesada (que en esto hay alguna
            diferencia en los autores que deste caso escriben), aunque por
            conjeturas verosímiles se deja entender que se llama Quijana; pero esto
            importa poco a nuestro cuento; basta que en la narración dél no se salga
            un punto de la verdad
          </Text>
          <Text style={styles.text}>
            _________________________________________________________
          </Text>

        </Page>
        <Page>
          <View style={styles.section}>
            <Text>{props.pdfViewData.type}</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    )}

    {props.pdfViewData.type === 'referral' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.text}>
            Dear Dr  _____________________________________
          </Text>
          <Text style={styles.text}>
            Thank you for referring  _____________________________________
          </Text>
          <Text style={styles.text}>
            who I saw on  _____________________________________
          </Text>
          <Text style={styles.text}>
            My findings are as follows :
          </Text>
          <Text style={styles.text}>
            _________________________________________________________
            _________________________________________________________
            _________________________________________________________
            _________________________________________________________
          </Text>
          <Text style={styles.text}>
            For this, I reccommend the following :
          </Text>
          <Text style={styles.text}>
            _________________________________________________________
            _________________________________________________________
            _________________________________________________________
            _________________________________________________________
          </Text>
          <Text style={styles.text}>
            He/She is booked to have  _____________________________________
          </Text>
          <Text style={styles.text}>
            and to be seen by me  _____________________________________
          </Text>
          <Text style={styles.text}>
            Thanks again for referring him/her.
          </Text>

        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'admissionReminder' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textCenter}>
            Operation/Admission Reminder
          </Text>
          <Text style={styles.textClose}>
            Name :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Age :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Address :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Name of Operation :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Hospital Name :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Address :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Date of Operation :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Time :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            You must attend  _____________________________________ Hospital
          </Text>
          <Text style={styles.textClose}>
            at ______________________________ a.m/p.m on ______________________________
          </Text>
          <Text style={styles.textClose}>
            You should have nothing to eat or drink after ______________________________
          </Text>
          <Text style={styles.textClose}>
            _______________________________ on _______________________________
          </Text>
          <Text style={styles.textClose}>
            Please take night clothes, toilet articles and hospital fee with you.
          </Text>
          <Text style={styles.textClose}>
            Estimated Cost :
          </Text>

        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'sickNote' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textCenter}>
            TO WHOM IT MAY CONCERN
          </Text>

          <Text style={styles.textRight}>
            Date : __________________________________
          </Text>

          <Text style={styles.textClose}>
            __________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________
          </Text>

          <Text style={styles.text}>
            Dear Sir/Madam,
          </Text>
          <Text style={styles.text}>
            This is to certify that I have seen and examined
          </Text>
          <Text style={styles.text}>
            Mr. / Mrs. / Miss  __________________________________
          </Text>
          <Text style={styles.textClose}>
            ____________________________________________________________________
          </Text>
          <Text style={styles.text}>
            and recommended that he/she should refrain from active duty
          </Text>
          <Text style={styles.text}>
            for at least  ____________________________ days
          </Text>
          <Text style={styles.text}>
            commencing  ____________________________________________________________
          </Text>
          <Text style={styles.textRight}>
            Yours Truly
          </Text>
          <Text style={styles.textRight}>

            __________________________________
          </Text>

        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'insurance' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textCenter}>
            INSURANCE
          </Text>

          <Text style={styles.textClose}>
            Patient's Name :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Age :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Address :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Subscriber :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Policy No :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Plan :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Employer :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Proposed Operation :  _____________________________________
          </Text>
          <Text style={styles.textClose}>
            Date of Operation :  _____________________________________
          </Text>
          <Text style={styles.textCenter}>
            Total          Ins wil Pay
          </Text>
          <Text style={styles.textClose}>
            Surgeon's Fee:
          </Text>
          <Text style={styles.textClose}>
            Assistant Surgeon's Fee:
          </Text>
          <Text style={styles.textClose}>
            Anesthetist's Fee:
          </Text>
          <Text style={styles.textClose}>
            Please review or approval for surgery and insurance payment.
          </Text>
          <Text style={styles.textClose}>
            Thanks
          </Text>


        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'diagnosisTesting' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textRight}>
            Date : ___________________________
          </Text>

          <Text style={styles.textClose}>
            Name :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            Age :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            Address :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            Diagnosis :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            Test(s) Required :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            ________________________________________________________________________
          </Text>

        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'prescription' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textCenter}>
            PRESCRIPTION
          </Text>


        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'treatmentConsent' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textCenter}>
            Consent for Medical/Surgical Treatment
          </Text>

          <Text style={styles.textClose}>
            Date :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            Patient's Name :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            Patient's Age :  _______________________________________________
          </Text>
          <Text style={styles.textClose}>
            I  _______________________ do hereby give consent to have _______________________
          </Text>
          <Text style={styles.textClose}>
            _____________________________ performed upon _____________________________
          </Text>
          <Text style={styles.textClose}>
            myself /my daughter /my son/ my spouse
          </Text>
          <Text style={styles.text}>
            The procedure, it's risks and possible complications have been fully explained to me. This procedure will be done under local anesthetic and or sedation. I understand and am in agreement with proceeding with same.
          </Text>
          <Text style={styles.text}>
            Signed : _______________________________________________
          </Text>
          <Text style={styles.text}>
            Name : _______________________________________________
          </Text>
          <Text style={styles.text}>
            Signed : _______________________________________________
          </Text>
          <Text style={styles.text}>
            Witness : _______________________________________________
          </Text>
          <Text style={styles.text}>
            Doctor/ Surgeon Signature : _______________________________________________
          </Text>
          <Text style={styles.text}>
            Name : _______________________________________________
          </Text>

        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'treatmentInstructions' && (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>{props.pdfViewData.type}</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    )}
    {props.pdfViewData.type === 'unfitToFly' && (
      <Document>
        <Page style={styles.body}>
          <Image
            style={styles.image}
            src={letterHead}
          />

          <Text style={styles.textCenter}>
            UNFIT TO FLY AUTHORIZATION
          </Text>

          <Text style={styles.textCenterClose}>
            Today's Date : ____________________________________
          </Text>
          <Text style={styles.textCenterClose}>
            Patient's Name : ____________________________________
          </Text>
          <Text style={styles.textCenterClose}>
            Date of Birth : ___________ Age : __________ Sex : _____
          </Text>

          <Text style={styles.textClose}>
            Clinical Features : _____________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>

          <Text style={styles.textClose}>
            Provisional Investigation : _____________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>

          <Text style={styles.textClose}>
            Conclusion : _____________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>
          <Text style={styles.textClose}>
            __________________________________________________________________
          </Text>

        </Page>
      </Document>
    )}

    </PDFViewer>

    </div>
  </div>
)

}

export default PdfView;
