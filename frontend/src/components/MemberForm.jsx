import { useState } from "react";
import api from "../services/api";
import {
  UserPlus,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function MemberForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    join_date: "",
    plan_months: "1",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ REAL DJANGO API (NO UI CHANGE)
      await api.post("add/", form);

      setNotification({
        show: true,
        type: "success",
        message: "Member added successfully!",
      });

      setForm({
        name: "",
        phone: "",
        join_date: "",
        plan_months: "1",
      });

      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000
      );
    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        type: "error",
        message: "Error adding member. Please try again.",
      });

      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const plans = [
    { value: "1", label: "1 Month", price: "₹1,000", popular: false },
    { value: "2", label: "2 Months", price: "₹1,500", popular: true },
    { value: "3", label: "3 Months", price: "₹2,500", popular: false },
    { value: "6", label: "6 Months", price: "₹4,500", popular: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Notification Toast */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 ${
              notification.type === "success"
                ? "bg-emerald-500 bg-opacity-90"
                : "bg-red-500 bg-opacity-90"
            } backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="font-semibold">{notification.message}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Add New Member
            </h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg ml-14">
            Register a new member to your gym
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
          <div className="space-y-6">
            {/* Name */}
            <div className="group">
              <label className="block text-slate-300 font-medium mb-2 text-sm uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <input
                  className="w-full p-4 pl-12 rounded-xl bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 outline-none"
                  placeholder="Enter member's full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-slate-300 font-medium mb-2 text-sm uppercase tracking-wide">
                Phone Number
              </label>
              <div className="relative">
                <input
                  className="w-full p-4 pl-12 rounded-xl bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 outline-none"
                  placeholder="Enter phone number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Join Date */}
            <div className="group">
              <label className="block text-slate-300 font-medium mb-2 text-sm uppercase tracking-wide">
                Join Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-4 pl-12 rounded-xl bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 outline-none"
                  name="join_date"
                  value={form.join_date}
                  onChange={handleChange}
                  required
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Plans */}
            <div className="group">
              <label className="block text-slate-300 font-medium mb-3 text-sm uppercase tracking-wide">
                Membership Plan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((plan) => (
                  <label
                    key={plan.value}
                    className={`relative cursor-pointer group/plan ${
                      form.plan_months === plan.value
                        ? "ring-2 ring-orange-500"
                        : "hover:ring-2 hover:ring-slate-600"
                    } rounded-xl transition-all duration-300`}
                  >
                    <input
                      type="radio"
                      name="plan_months"
                      value={plan.value}
                      checked={form.plan_months === plan.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        form.plan_months === plan.value
                          ? "bg-gradient-to-r from-orange-500 to-red-500 border-transparent"
                          : "bg-slate-700 bg-opacity-50 border-slate-600"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              form.plan_months === plan.value
                                ? "text-white"
                                : "text-slate-200"
                            }`}
                          >
                            {plan.label}
                          </p>
                          <p
                            className={`text-sm ${
                              form.plan_months === plan.value
                                ? "text-orange-100"
                                : "text-slate-400"
                            }`}
                          >
                            {plan.price}
                          </p>
                        </div>
                        <CreditCard
                          className={`w-6 h-6 ${
                            form.plan_months === plan.value
                              ? "text-white"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Adding Member...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Add Member</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm text-center">
            All fields are required. The member will receive confirmation
            details after registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MemberForm;
