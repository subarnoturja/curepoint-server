const User = require ('../models/UserSchema')
const Doctor = require ('../models/DoctorSchema')
const Booking = require ('../models/BookingSchema')
const Stripe = require('stripe');
require('dotenv').config();

const getCheckoutSession = async(req, res) => {
    try {
        // get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId)
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) 
        
        // create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url:`${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
            client_reference_id: req.params.doctorId,
            line_items:[
                {
                    price_data: {
                        currency:"bdt",
                        unit_amount:doctor.ticketPrice * 100,
                        product_data:{
                            name:doctor.name,
                            description:doctor.bio,
                            images:[doctor.photo]
                        }
                    },
                    quantity:1
                }
            ]
        })

        // Create New Booking
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            session:session.id
        })

        // to save into database
        await booking.save()

        res.status(200).json({ success:true, message:"Successfully Paid", session })

    } catch (error) {
        console.log("getCheckoutSession error:", error)
        res.status(500).json({ success: false, message: "Error creating checkout session" })
    }
}

module.exports = { getCheckoutSession };