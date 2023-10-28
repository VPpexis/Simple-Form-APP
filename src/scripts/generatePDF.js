import { PDFDocument } from 'pdf-lib';
import firebase from '../scripts/initFirebase';
import imgResize from './imgResize';
// This part can be optimized
// Error will occur if pdf file is change.
// But for now it works.

export default async function generatePDF(data) {
    const formURL = 'https://firebasestorage.googleapis.com/v0/b/schnieder-4c890.appspot.com/o/templates%2Ffeedback-report-template.pdf?alt=media&token=84d5bf2a-ea17-4367-85a8-75a469c7bd9c';
    const formPDFBytes = await fetch(formURL).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPDFBytes);
    const st = firebase.storage();
    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];

    const departmentTextField = form.getTextField('Department');
    const classificationTextField = form.getTextField('Classification');
    const dateTextField = form.getTextField('Date');
    const date2TextField = form.getTextField('Date_2');
    const attentionToTextField = form.getTextField('Attention_To');
    const controlNumberTextField = form.getTextField('Control_Number');
    const issueDateTextField = form.getTextField('Issue_Date');
    const facilityAffectedTextField = form.getTextField('Facility_Affected');
    const supplierTextField = form.getTextField('Supplier');
    const reportedByTextField = form.getTextField('Reported_By');
    const sourceTextField = form.getTextField('Source');
    const defectDescriptionTextField = form.getTextField('Defect_Description');
    const partNumberTextField = form.getTextField('Part_Number');
    const partDescriptionTextField = form.getTextField('Part_Description');
    const datacodeTextField = form.getTextField('Datacode');
    const inspectedQtyTextField = form.getTextField('Inspected_Qty');
    const defectQtyTextField = form.getTextField('Defect_Qty');
    const percentTextField = form.getTextField('Percent');
    const dataReceivedTextField = form.getTextField('Data_Received');
    const receivedQtyTextField = form.getTextField('Recieved_Qty');
    const affectedModelTextField = form.getTextField('Affected_Model');
    const cellTextField = form.getTextField('cell');
    const factoryContainmentActionTextField = form.getTextField('factory_containment_action');
    const factoryRootcauseAnalysisTextField = form.getTextField('factory_rootcause_analysis');
    const supplierContainmentActionTextField = form.getTextField('supplier_containment_action');
    const supplierRootcauseAnalysisTextField = form.getTextField('supplier_rootcause_analysis');
    const supplierCorrectiveActionTextField = form.getTextField('supplier_corrective_action');
    const verificationOfCorrectiveActionTextField = form.getTextField('verification_of_corrective_action');
    const performedByTextField = form.getTextField('performed_by');
    const performedDateTextField = form.getTextField('performed_date');
    const verifiedByTextField = form.getTextField('verified_by');
    const verifiedDateTextField = form.getTextField('verified_date');

    const majorCheckBox = form.getCheckBox('Major');
    const minorCheckBox = form.getCheckBox('Minor');

    const iqcCheckBox = form.getCheckBox('IQC');
    const smtCheckBox = form.getCheckBox('SMT');
    const qaCheckBox = form.getCheckBox('QA');
    const otherDetectCheckBox = form.getCheckBox('Others');

    const rawMaterialCheckBox = form.getCheckBox('Raw_Material');
    const wipCheckBox = form.getCheckBox('WIP');
    const finishGoodCheckBox = form.getCheckBox('finish_good');
    const customerComplainCheckBox = form.getCheckBox('customer_complain');
    const designProblemCheckBox = form.getCheckBox('design_problem');
    const supplierIssueCheckBox = form.getCheckBox('supplier_issue');
    const processRelatedCheckBox = form.getCheckBox('process_related');
    const deliverProblemCheckBox = form.getCheckBox('delivery_problem');
    const otherClassificationCheckBox = form.getCheckBox('others');

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) dd = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;
    date2TextField.setText(formattedToday);
    dateTextField.setText(formattedToday);

    departmentTextField.setText("Quality Assurance");
    classificationTextField.setText("Form");

    if (data.containmentActionFac !== undefined) factoryContainmentActionTextField.setText(data.containmentActionFac);
    if (data.rootcauseAnalysisFac !== undefined) factoryRootcauseAnalysisTextField.setText(data.rootcauseAnalysisFac);
    if (data.containmentActionSup !== undefined) supplierContainmentActionTextField.setText(data.containmentActionSup);
    if (data.rootcauseAnalysisSup !== undefined) supplierRootcauseAnalysisTextField.setText(data.rootcauseAnalysisSup);
    if (data.correctiveActionSup !== undefined) supplierCorrectiveActionTextField.setText(data.correctiveActionSup);
    if (data.veriCorrAct !== undefined) verificationOfCorrectiveActionTextField.setText(data.veriCorrAct);
    if (data.performedby !== undefined) performedByTextField.setText(data.performedby);
    if (data.verifiedBy !== undefined) verifiedByTextField.setText(data.verifiedBy);
    if (data.performedDate != undefined) performedDateTextField.setText(data.performedDate);
    if (data.verifiedDate != undefined) verifiedDateTextField.setText(data.verifiedDate);

    if (data.illustration2 != undefined) {
        const unit8ArrayImg = await data.illustration2.arrayBuffer();
        const pngImage = await pdfDoc.embedPng(unit8ArrayImg);
        let pngDims = pngImage.scale(0.25);

        pngDims = imgResize(250, 300, pngDims);
        secondPage.drawImage(pngImage, {
            x: 45,
            y: 220,
            width: pngDims.width,
            height: pngDims.height
        })
    }

    if (data.illustration3 != undefined) {
        const unit8ArrayImg = await data.illustration3.arrayBuffer();
        const pngImage = await pdfDoc.embedPng(unit8ArrayImg);
        let pngDims = pngImage.scale(0.25);

        pngDims = imgResize(250, 300, pngDims);
        secondPage.drawImage(pngImage, {
            x: 310,
            y: 220,
            width: pngDims.width,
            height: pngDims.height
        })
    }

    if (data.illustration1 != undefined) {
        const unit8ArrayImg = await fetch(data.illustration1).then(res => res.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(unit8ArrayImg);
        let pngDims = pngImage.scale(0.25);
        
        pngDims = imgResize(525, 230, pngDims);

        firstPage.drawImage(pngImage, {
            x: 45,
            y: 150,
            width: pngDims.width,
            height: pngDims.height
        })
    }

    if (data.category !== undefined) {
        if (data.category === "Major") majorCheckBox.check();
        if (data.category === "Minor") minorCheckBox.check();
    }

    if (data.detectedAt !== undefined) {
        if (data.detectedAt === "SMT/AI/MI/FA") smtCheckBox.check();
        if (data.detectedAt === "IQC") iqcCheckBox.check();
        if (data.detectedAt === "QA") qaCheckBox.check();
        if (data.detectedAt === "Other(JAC)") otherDetectCheckBox.check();
    }

    if (data.classification !== undefined) {
        if (data.classification === "Raw Material") rawMaterialCheckBox.check();
        if (data.classification === "W.I.P") wipCheckBox.check();
        if (data.classification === "Finish Goods") finishGoodCheckBox.check();
        if (data.classification === "Customer Complain") customerComplainCheckBox.check();
        if (data.classification === "Design Problems") designProblemCheckBox.check();
        if (data.classification === "Supplier Issue") supplierIssueCheckBox.check();
        if (data.classification === "Delivery Problem") deliverProblemCheckBox.check();
    }

    if (data.controlNumber !== undefined) {
        controlNumberTextField.setText(data.controlNumber);
    }
    if (data.attentionTo !== undefined) {
        attentionToTextField.setText(data.attentionTo)
    }
    if (data.issueDate !== undefined) {
        issueDateTextField.setText(data.issueDate)
    }
    if (data.facilityAffected !== undefined) {
        facilityAffectedTextField.setText(data.facilityAffected)
    }
    if (data.supplier !== undefined) {
        supplierTextField.setText(data.supplier);
    }
    if (data.reportedBy !== undefined) {
        reportedByTextField.setText(data.reportedBy);
    }
    if (data.source !== undefined) {
        sourceTextField.setText(data.source);
    }
    if (data.defectDescription !== undefined) {
        defectDescriptionTextField.setText(data.defectDescription);
    }
    if (data.partNumber !== undefined) {
        partNumberTextField.setText(data.partNumber);
    }
    if (data.partDescription !== undefined) {
        partDescriptionTextField.setText(data.partDescription);
    }
    if (data.datacode !== undefined) {
        datacodeTextField.setText(data.datacode);
    }
    if (data.dataReceived !== undefined) {
        dataReceivedTextField.setText(data.dataReceived);
    }
    if (data.receivedQty !== undefined) {
        receivedQtyTextField.setText(data.receivedQty);
    }
    if (data.inspectedQty !== undefined) {
        inspectedQtyTextField.setText(data.inspectedQty);
    }
    if (data.defectQty !== undefined) {
        defectQtyTextField.setText(data.defectQty);
    }
    if (data.percent !== undefined) {
        percentTextField.setText(data.percent);
    }
    if (data.affectedModel !== undefined) {
        affectedModelTextField.setText(data.affectedModel);
    }
    if (data.cell !== undefined) {
        cellTextField.setText(data.cell);
    }

    form.flatten();
    const pdfBytes = await pdfDoc.save();

    const file = new Blob([pdfBytes], {type: 'application/pdf'});
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = "sample.pdf";
    document.body.appendChild(element);
    element.click();
}
