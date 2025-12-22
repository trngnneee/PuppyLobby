import express from "express"
import db from "./../utils/db.js"
import * as authMiddleware from "../middleware/auth.middleware.js"
const router = express.Router()


router.get("/", authMiddleware.verifyToken, async (req, res) => {
    const result = await db.raw(
        `
        SELECT invoice_id
        FROM invoice
        WHERE customer_id = ?
          AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [req.account.customer_id]
      );
    
    const response = result.rows[0];
    if (!response) {
      return res.json({
        code: "success",
        message: "Cart is empty",
        cartItems: [],
        totalAmount: 0
      });
    }
    const invoice_id = response.invoice_id;

    const cartResult = await db.raw(
      `
      SELECT
        p.images,
        ip.product_id,
        p.product_name,
        p.price,
        p.type,
        ip.invoice_id,
        ip.quantity
      FROM invoiceproduct ip
      JOIN product p ON ip.product_id = p.product_id
      WHERE ip.invoice_id = ?
      ORDER BY p.product_id ASC
      `,
      [invoice_id]
    );

    const cartItems = cartResult.rows;

    const medicalRecords = await db.raw(
      `
      SELECT
        sb.booking_id,
        p.pet_name,
        me.symptom,
        me.diagnosis,
        me.prescription,
        sb.price,
        sb.status,
        me.next_appointment
      FROM servicebooking sb
      JOIN pet p ON p.pet_id = sb.pet_id
      JOIN medicalexamination me ON me.booking_id = sb.booking_id
      WHERE sb.invoice_id = ?;
      `, [invoice_id]
    );
    

    const medicalExaminations = medicalRecords.rows;
    console.log("Medical Examinations:", medicalExaminations);

    const vaccinationSingleRecords = await db.raw(
      `
      SELECT
        sb.booking_id,
        p.pet_name,
        v.vaccine_name,
        vss.dosage,
        sb.price,
        sb.status,
        sb.date
      FROM servicebooking sb
      JOIN pet p ON p.pet_id = sb.pet_id
      JOIN VaccinationSingleService vss ON vss.booking_id = sb.booking_id
      JOIN Vaccine v ON v.vaccine_id = vss.vaccine_id
      WHERE sb.invoice_id = ?
      `
      , [invoice_id]
    );

    const vaccinationSingles = vaccinationSingleRecords.rows;
    console.log("Vaccination Singles:", vaccinationSingles);


    const vaccinationComboRecords = await db.raw(
      `
      SELECT
        sb.booking_id,
        p.pet_name,
        vp.package_id,
        vp.package_name,
        vps.start_date,
        vps.end_date,
        vp.duration,
        vp.discount_rate,
        sb.price,
        sb.status,
        json_agg(
        json_build_object(
        'scheduled_week', vs.scheduled_week,
        'vaccine_id', v.vaccine_id,
        'vaccine_name', v.vaccine_name,
        'dosage', vs.dosage
        )
        ORDER BY vs.scheduled_week
        ) AS vaccines
      FROM servicebooking sb
      JOIN pet p ON p.pet_id = sb.pet_id
      JOIN VaccinationPackageService vps ON vps.booking_id = sb.booking_id
      JOIN VaccinationPackage vp ON vp.package_id = vps.package_id
      JOIN VaccinationSchedule vs ON vs.package_id = vp.package_id
      JOIN Vaccine v ON v.vaccine_id = vs.vaccine_id
      WHERE sb.invoice_id = ?
      GROUP BY
        sb.booking_id,
        p.pet_name,
        vp.package_id,
        vp.package_name,
        vps.start_date,
        vps.end_date,
        vp.duration,
        vp.discount_rate,
        sb.price,
        sb.status
      `,[invoice_id]
    );

    const vaccinationCombos = vaccinationComboRecords.rows;
    console.log("Vaccination Combos:", vaccinationCombos);
    
    const totalAmount = await db.raw(
      `
      SELECT get_invoice_total_price(?)
      `,
      [req.account.customer_id]
    );

    const total = totalAmount.rows[0].get_invoice_total_price || 0;

    res.json({
      code: "success",
      message: "Cart fetched successfully",
      cartItems: cartItems,
      medicalExaminations: medicalExaminations,
      vaccinationSingles: vaccinationSingles,
      vaccinationCombos: vaccinationCombos,
      totalAmount: total
    });
});


export default router