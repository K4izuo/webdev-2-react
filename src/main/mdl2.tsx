import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Upload, User, MapPin, BookOpen, Users, Bookmark, CheckCircle, Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { X, AlertCircle } from "lucide-react"

type FieldErrors = {
  [key: string]: string
}

const ErrorPopup = ({ error, onClose }: { error: string; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md"
    >
      <div className="bg-red-50 border-l-4 border-red-500 rounded-md shadow-lg">
        <div className="flex items-center p-3 sm:p-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm sm:text-base text-red-700">{error}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function StudentForm() {
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [date, setDate] = useState<Date>()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState("")
  const [showPopupError, setShowPopupError] = useState(false)

  const steps = [
    { name: "Personal Info", icon: <User className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Location", icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Education", icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "References", icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Documents", icon: <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Complete", icon: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> },
  ]

  const initialStudentData = useMemo(
    () => ({
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      address: "",
      previousSchool: "",
      previousDegree: "",
      gpa: "",
      intendedProgram: "",
      entranceExamScore: "",
      personalStatement: "",
      reference1: "",
      reference2: "",
      extraCurricular: "",
    }),
    [],
  )

  const initialFinancialData = useMemo(
    () => ({
      documentsUploaded: false,
      termsAccepted: false,
    }),
    [],
  )

  const [studentApplicationData, setStudentApplicationData] = useState(initialStudentData)
  const [financialAidData, setFinancialAidData] = useState(initialFinancialData)

  // Required fields for each step
  const requiredFields = useMemo(
    () => [
      ["firstName", "middleName", "lastName", "dateOfBirth", "email", "phone"], // Step 0
      ["address"], // Step 1
      ["previousSchool", "intendedProgram"], // Step 2
      [], // Step 3 - no required fields
      ["termsAccepted"], // Step 4
    ],
    [],
  )

  // Memoize resetForm function to avoid unnecessary re-renders
  const resetForm = useCallback(() => {
    setActiveStep(0)
    setDate(undefined)
    setFormSubmitted(false)
    setStudentApplicationData(initialStudentData)
    setFinancialAidData(initialFinancialData)
    setErrors({})
    setFormError("")
    setIsLoading(false)
  }, [initialStudentData, initialFinancialData])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && formSubmitted) {
      resetForm()
    }
  }, [open, formSubmitted, resetForm])

  useEffect(() => {
    if (formError) {
      setShowPopupError(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowPopupError(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [formError])

  const handleStudentApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStudentApplicationData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setStudentApplicationData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user selects a value
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFinancialAidData((prev) => ({ ...prev, [name]: checked }))

    // Clear error for this field when user checks/unchecks
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setStudentApplicationData((prev) => ({ ...prev, dateOfBirth: format(date, "PP") }))

      // Clear error for dateOfBirth when user selects a date
      if (errors.dateOfBirth) {
        setErrors((prev) => ({ ...prev, dateOfBirth: "" }))
      }
    }
  }

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone number format (basic validation)
  const isValidPhone = (phone: string) => {
    if (!phone) return true // Phone is optional
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/
    return phoneRegex.test(phone)
  }

  // Validate current step
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: FieldErrors = {}
    let isValid = true

    // Validate required fields for current step
    requiredFields[stepIndex]?.forEach((field) => {
      if (field === "termsAccepted") {
        if (!financialAidData.termsAccepted) {
          newErrors[field] = "You must accept the terms to continue"
          isValid = false
        }
      } else if (!studentApplicationData[field as keyof typeof studentApplicationData]) {
        newErrors[field] = "This field is required"
        isValid = false
      }
    })

    // Additional validation for specific fields
    if (stepIndex === 0) {
      if (studentApplicationData.email && !isValidEmail(studentApplicationData.email)) {
        newErrors.email = "Please enter a valid email address"
        isValid = false
      }

      if (studentApplicationData.phone && !isValidPhone(studentApplicationData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    // Validate current step
    if (!validateStep(activeStep)) {
      setFormError("Please fix the errors before proceeding")
      return
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      setFormError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    // Validate current step
    if (!validateStep(activeStep)) {
      setFormError("Please fix the errors before submitting")
      return
    }

    // Start loading
    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Handle form submission logic
      console.log("Student Application submitted:", studentApplicationData)
      console.log("Financial Aid submitted:", financialAidData)

      // Move to final step
      setActiveStep(steps.length - 1)
      setFormSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormError("An error occurred while submitting the form. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <form onSubmit={handleNext} className="h-[220px] xs:h-[240px] sm:h-[300px] overflow-y-auto px-3 sm:px-4">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="firstName"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={studentApplicationData.firstName}
                  onChange={handleStudentApplicationChange}
                  className={cn(
                    "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                    errors.firstName && "border-red-500",
                  )}
                  placeholder="Enter your first name"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  </div>
                )}
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="middleName"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Middle Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={studentApplicationData.middleName}
                  onChange={handleStudentApplicationChange}
                  className={cn(
                    "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                    errors.middleName && "border-red-500",
                  )}
                  placeholder="Enter your middle name"
                  disabled={isLoading}
                />
                {errors.middleName && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.middleName}</p>
                  </div>
                )}
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="lastName"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={studentApplicationData.lastName}
                  onChange={handleStudentApplicationChange}
                  className={cn(
                    "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                    errors.lastName && "border-red-500",
                  )}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-4 sm:mt-5">
              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="dateOfBirth"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 max-md:text-sm sm:max-md:text-sm",
                        !date && "text-gray-400",
                        errors.dateOfBirth && "border-red-500",
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                  </div>
                )}
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="email"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={studentApplicationData.email}
                  onChange={handleStudentApplicationChange}
                  className={cn(
                    "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                    errors.email && "border-red-500",
                  )}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.email}</p>
                  </div>
                )}
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="phone"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={studentApplicationData.phone}
                  onChange={handleStudentApplicationChange}
                  className={cn(
                    "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                    errors.phone && "border-red-500",
                  )}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden">
              <Button type="submit" disabled={isLoading}>
                Next
              </Button>
            </div>
          </form>
        )
      case 1:
        return (
          <form onSubmit={handleNext} className="h-[220px] xs:h-[240px] sm:h-[300px] overflow-y-auto px-3 sm:px-4">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5">Address Information</h3>

            <div className="mt-4 sm:mt-5 relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
              <Label
                htmlFor="address"
                className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
              >
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={studentApplicationData.address}
                onChange={handleStudentApplicationChange}
                className={cn(
                  "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                  errors.address && "border-red-500",
                )}
                placeholder="Enter your address"
                disabled={isLoading}
              />
              {errors.address && (
                <div className="flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                  <p className="text-xs text-red-500">{errors.address}</p>
                </div>
              )}
            </div>

            <div className="hidden">
              <Button type="submit" disabled={isLoading}>
                Next
              </Button>
            </div>
          </form>
        )
      case 2:
        return (
          <form onSubmit={handleNext} className="h-[220px] xs:h-[240px] sm:h-[300px] overflow-y-auto px-3 sm:px-4">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5">Previous Education</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="previousSchool"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Previous School <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="previousSchool"
                  name="previousSchool"
                  value={studentApplicationData.previousSchool}
                  onChange={handleStudentApplicationChange}
                  className={cn(
                    "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                    errors.previousSchool && "border-red-500",
                  )}
                  placeholder="Enter your previous school"
                  disabled={isLoading}
                />
                {errors.previousSchool && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.previousSchool}</p>
                  </div>
                )}
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="previousDegree"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Previous Degree/Certificate
                </Label>
                <Input
                  id="previousDegree"
                  name="previousDegree"
                  value={studentApplicationData.previousDegree}
                  onChange={handleStudentApplicationChange}
                  className="h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                  placeholder="Enter your previous degree"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="gpa"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  GPA
                </Label>
                <Input
                  id="gpa"
                  name="gpa"
                  value={studentApplicationData.gpa}
                  onChange={handleStudentApplicationChange}
                  className="h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                  placeholder="Enter your GPA"
                  disabled={isLoading}
                />
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="intendedProgram"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Intended Program/Major <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={studentApplicationData.intendedProgram}
                  onValueChange={(value) => handleSelectChange("intendedProgram", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="intendedProgram"
                    className={cn(
                      "h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 max-md:text-sm sm:max-md:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]",
                      errors.intendedProgram && "border-red-500",
                    )}
                  >
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business Administration</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="arts">Arts and Humanities</SelectItem>
                  </SelectContent>
                </Select>
                {errors.intendedProgram && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">{errors.intendedProgram}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-5 relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
              <Label
                htmlFor="entranceExamScore"
                className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
              >
                Entrance Examination Score
              </Label>
              <Input
                id="entranceExamScore"
                name="entranceExamScore"
                value={studentApplicationData.entranceExamScore}
                onChange={handleStudentApplicationChange}
                className="h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                placeholder="Enter your entrance exam score"
                disabled={isLoading}
              />
            </div>

            <div className="hidden">
              <Button type="submit" disabled={isLoading}>
                Next
              </Button>
            </div>
          </form>
        )
      case 3:
        return (
          <form onSubmit={handleNext} className="h-[220px] xs:h-[240px] sm:h-[300px] overflow-y-auto px-3 sm:px-4">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5">References & Additional Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="reference1"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Reference 1
                </Label>
                <Input
                  id="reference1"
                  name="reference1"
                  value={studentApplicationData.reference1}
                  onChange={handleStudentApplicationChange}
                  className="h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                  placeholder="Enter reference name and contact"
                  disabled={isLoading}
                />
              </div>

              <div className="relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
                <Label
                  htmlFor="reference2"
                  className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
                >
                  Reference 2
                </Label>
                <Input
                  id="reference2"
                  name="reference2"
                  value={studentApplicationData.reference2}
                  onChange={handleStudentApplicationChange}
                  className="h-9 sm:h-10 md:h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                  placeholder="Enter reference name and contact"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-5 relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
              <Label
                htmlFor="personalStatement"
                className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
              >
                Personal Statement/Essay
              </Label>
              <Textarea
                id="personalStatement"
                name="personalStatement"
                value={studentApplicationData.personalStatement}
                onChange={handleStudentApplicationChange}
                className="min-h-[80px] sm:min-h-[120px] bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                placeholder="Write your personal statement here..."
                disabled={isLoading}
              />
            </div>

            <div className="mt-4 sm:mt-5 relative border border-gray-200 rounded-md p-3 sm:p-4 pt-5 sm:pt-6 bg-white shadow-sm">
              <Label
                htmlFor="extraCurricular"
                className="absolute -top-2.5 left-3 px-1 bg-white text-gray-500 font-normal text-xs sm:text-sm"
              >
                Extra-curricular Activities
              </Label>
              <Textarea
                id="extraCurricular"
                name="extraCurricular"
                value={studentApplicationData.extraCurricular}
                onChange={handleStudentApplicationChange}
                className="min-h-[80px] sm:min-h-[100px] bg-gray-50 border-gray-200 placeholder:text-gray-400 max-md:placeholder:text-sm sm:max-md:placeholder:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                placeholder="List your extra-curricular activities..."
                disabled={isLoading}
              />
            </div>

            <div className="hidden">
              <Button type="submit" disabled={isLoading}>
                Next
              </Button>
            </div>
          </form>
        )
      case 4:
        return (
          <form onSubmit={handleSubmit} className="h-[220px] xs:h-[240px] sm:h-[300px] overflow-y-auto px-3 sm:px-4">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-2">Documents</h3>

            <div className="border border-gray-200 rounded-md p-3 sm:p-4 bg-white shadow-sm">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 bg-gray-50">
                <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-2" />
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Upload required documents</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mb-3">PDF, JPG, or PNG files up to 10MB</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-white h-7 sm:h-9"
                  onClick={() => handleCheckboxChange("documentsUploaded", true)}
                  disabled={isLoading}
                >
                  Select Files
                </Button>
                {financialAidData.documentsUploaded && (
                  <p className="text-[10px] sm:text-xs text-green-500 mt-2">Documents uploaded successfully</p>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex items-center space-x-2">
              <Checkbox
                id="termsAccepted"
                checked={financialAidData.termsAccepted}
                onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                className={cn("h-3 w-3 sm:h-4 sm:w-4", errors.termsAccepted && "border-red-500")}
                disabled={isLoading}
              />
              <Label htmlFor="termsAccepted" className="text-xs sm:text-sm font-medium">
                I certify that all information provided is accurate and complete <span className="text-red-500">*</span>
              </Label>
            </div>
            {errors.termsAccepted && (
              <div className="flex items-center mt-1 ml-6">
                <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                <p className="text-xs text-red-500">{errors.termsAccepted}</p>
              </div>
            )}

            <div className="hidden">
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </div>
          </form>
        )
      case 5:
        return (
          <div className="h-[220px] xs:h-[240px] sm:h-[300px] overflow-hidden px-3 sm:px-4">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5">Application Complete</h3>
            <div className="flex flex-col items-center justify-center h-[170px] sm:h-[220px]">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-center mb-2">Application Submitted!</h3>
              <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 px-3 sm:px-4">
                Thank you for submitting your application. We will review it and get back to you soon.
              </p>
              <Button
                onClick={() => setOpen(false)}
                className="bg-[#1e88e5] hover:bg-[#1976d2] h-8 sm:h-9 text-xs sm:text-sm px-5 sm:px-6"
              >
                Close
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <AnimatePresence>
        {showPopupError && formError && <ErrorPopup error={formError} onClose={() => setShowPopupError(false)} />}
      </AnimatePresence>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            // Reset form when dialog is closed after submission
            if (formSubmitted) {
              setTimeout(() => {
                resetForm()
              }, 100)
            }
          }
          setOpen(newOpen)
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-[#1e88e5] hover:bg-[#1976d2]">Open Student Forms</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1000px] max-h-[97vh] w-[97vw] p-3 sm:p-4 md:p-6 overflow-hidden rounded-lg"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus when modal opens
        >
          {/* Custom close button - only visible on desktop/laptop */}
          <div className="hidden md:block absolute top-3 right-3 z-50">
            <button
              onClick={() => setOpen(false)}
              className="bg-white hover:bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center border border-gray-200 shadow-sm transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 60px)" }}>
            <DialogHeader className="pb-2 sm:pb-4 md:pb-6">
              <DialogTitle className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#1e88e5] font-poppins">
                Student Management System
              </DialogTitle>
            </DialogHeader>

            {/* Progress Indicator */}
            <div className="w-full overflow-hidden py-1 sm:py-2 mt-1 sm:mt-2 md:mt-4">
              <div className="flex items-center justify-between px-1 sm:px-2 md:px-4 relative">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative z-10">
                    <div
                      className={cn(
                        "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2",
                        index === activeStep
                          ? "bg-[#4285f4] text-white"
                          : index < activeStep
                            ? "bg-gray-200 text-gray-600"
                            : "bg-gray-200 text-gray-400",
                      )}
                    >
                      {step.icon}
                    </div>
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500 hidden xs:block">
                      {step.name}
                    </span>
                  </div>
                ))}
                {/* Connecting lines */}
                <div
                  className="absolute top-3 xs:top-3.5 sm:top-4 md:top-5 h-[1px] bg-gray-200"
                  style={{
                    left: "calc(10% + 12px)",
                    right: "calc(10% + 12px)",
                    width: "calc(80% - 24px)",
                    zIndex: 1,
                  }}
                ></div>
              </div>
            </div>

            {/* Form Content with fixed height */}
            <div className="overflow-y-auto px-0 py-2 sm:py-3" style={{ maxHeight: "calc(60vh + 80px)" }}>
              <Card className="border-none shadow-none">
                <CardContent className="p-0 pb-1 sm:pb-2">{renderStepContent()}</CardContent>
              </Card>
            </div>

            {/* Navigation Buttons - positioned closer to content */}
            <div className="py-2 sm:py-3 border-t mt-1 sm:mt-2">
              <div className="flex justify-between items-center px-2 sm:px-3">
                <div>
                  {activeStep > 0 && activeStep < steps.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                      onClick={handlePrevious}
                      disabled={isLoading}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {activeStep < steps.length - 1 ? (
                    <Button
                      type="submit"
                      form={`step-${activeStep}-form`}
                      size="sm"
                      className="h-8 sm:h-9 md:h-10 bg-[#1e88e5] hover:bg-[#1976d2] text-xs sm:text-sm"
                      onClick={activeStep === 4 ? handleSubmit : handleNext}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {activeStep === 4 ? "Submitting..." : "Processing..."}
                        </>
                      ) : activeStep === 4 ? (
                        "Submit"
                      ) : (
                        "Next"
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

