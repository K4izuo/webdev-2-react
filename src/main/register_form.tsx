import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    course: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCourseChange = (value: string) => {
    setFormData((prev) => ({ ...prev, course: value }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#1e88e5] font-poppins">
        Create Student Record
      </h1>

      <Card className="border-none shadow-none">
        <CardContent className="p-0 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative border border-gray-200 rounded-md p-3 pt-5 bg-white shadow-sm">
              <Label
                htmlFor="studentNumber"
                className="absolute -top-2.5 left-4 px-1 bg-white text-gray-500 font-normal text-sm"
              >
                Student Number
              </Label>
              <Input
                id="studentNumber"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0"
                placeholder="Enter student number"
              />
            </div>

            <div className="relative border border-gray-200 rounded-md p-3 pt-5 bg-white shadow-sm">
              <Label
                htmlFor="firstName"
                className="absolute -top-2.5 left-4 px-1 bg-white text-gray-500 font-normal text-sm"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0"
                placeholder="Enter your first name"
              />
            </div>

            <div className="relative border border-gray-200 rounded-md p-3 pt-5 bg-white shadow-sm">
              <Label
                htmlFor="middleName"
                className="absolute -top-2.5 left-4 px-1 bg-white text-gray-500 font-normal text-sm"
              >
                Middle Name
              </Label>
              <Input
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0"
                placeholder="Enter your middle name"
              />
            </div>

            <div className="relative border border-gray-200 rounded-md p-3 pt-5 bg-white shadow-sm">
              <Label
                htmlFor="lastName"
                className="absolute -top-2.5 left-4 px-1 bg-white text-gray-500 font-normal text-sm"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          <div className="mt-4 relative border border-gray-200 rounded-md p-3 pt-5 bg-white shadow-sm">
            <Label
              htmlFor="course"
              className="absolute -top-2.5 left-4 px-1 bg-white text-gray-500 font-normal text-sm"
            >
              Course
            </Label>
            <Select value={formData.course} onValueChange={handleCourseChange}>
              <SelectTrigger id="course" className="h-11 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business Administration</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="arts">Arts and Humanities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

