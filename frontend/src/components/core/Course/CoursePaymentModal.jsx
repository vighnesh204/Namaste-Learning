import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-hot-toast';

const CoursePaymentModal = ({ courseName, price, thumbnail, handlePayment, setPaymentModal }) => {
    const [isVerifying, setIsVerifying] = useState(false);

    // Keep fields pre-filled for a frictionless testing experience
    const [formData, setFormData] = useState({
        cardName: "John Doe",
        cardNumber: "4242 4242 4242 4242",
        expiry: "12/28",
        cvv: "123"
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const processMockPayment = () => {
        setIsVerifying(true);
        const toastId = toast.loading("Verifying secure connection...");
        
        setTimeout(() => {
            toast.dismiss(toastId);
            setIsVerifying(false);
            setPaymentModal(false);
            handlePayment(); // Hands off to buyCourse API
        }, 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="w-11/12 max-w-[450px] rounded-2xl bg-richblack-800 border border-richblack-600 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-richblack-600 bg-richblack-700">
                        <p className="text-xl font-semibold text-richblack-5">Secure Checkout</p>
                        <button onClick={() => !isVerifying && setPaymentModal(false)} className="text-richblack-200 hover:text-white transition-all">
                            <RxCross2 size={24} />
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-4 bg-richblack-900/50 p-3 rounded-lg border border-richblack-700">
                            <img src={thumbnail} alt="course thumbnail" className="w-[80px] h-[50px] object-cover rounded-md" />
                            <div className="flex flex-col">
                                <p className="text-richblack-5 font-medium line-clamp-1 text-sm">{courseName}</p>
                                <p className="text-yellow-50 font-bold">Rs. {price}</p>
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-richblack-600 my-2"></div>

                        {/* Card Form */}
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-richblack-200 uppercase tracking-wider">Name on Card</span>
                                <input disabled={isVerifying} type="text" name="cardName" value={formData.cardName} onChange={handleFormChange} className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:ring-1 focus:ring-yellow-50 transition-all font-mono" />
                            </label>
                            
                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-richblack-200 uppercase tracking-wider">Card Number</span>
                                <input disabled={isVerifying} type="text" name="cardNumber" value={formData.cardNumber} onChange={handleFormChange} className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:ring-1 focus:ring-yellow-50 transition-all font-mono tracking-widest text-lg" />
                            </label>

                            <div className="flex gap-4">
                                <label className="flex flex-col gap-1 w-1/2">
                                    <span className="text-xs text-richblack-200 uppercase tracking-wider">Expiry</span>
                                    <input disabled={isVerifying} type="text" name="expiry" value={formData.expiry} onChange={handleFormChange} className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:ring-1 focus:ring-yellow-50 transition-all font-mono" />
                                </label>
                                <label className="flex flex-col gap-1 w-1/2">
                                    <span className="text-xs text-richblack-200 uppercase tracking-wider">CVV</span>
                                    <input disabled={isVerifying} type="text" name="cvv" value={formData.cvv} onChange={handleFormChange} className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:ring-1 focus:ring-yellow-50 transition-all font-mono" />
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Action */}
                    <div className="p-5 border-t border-richblack-600 bg-richblack-900/40">
                        <button
                            disabled={isVerifying}
                            onClick={processMockPayment}
                            className={`w-full py-3 rounded-lg font-bold text-center transition-all ${isVerifying ? 'bg-richblack-500 text-richblack-300 cursor-not-allowed' : 'bg-yellow-50 text-richblack-900 hover:scale-[1.02] hover:bg-yellow-100 shadow-[0_0_20px_rgba(255,214,10,0.4)]'}`}
                        >
                            {isVerifying ? "Verifying Details..." : `Pay Rs. ${price}`}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CoursePaymentModal;
