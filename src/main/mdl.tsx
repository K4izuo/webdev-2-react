import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function Mdl() {
  const [open, setOpen] = useState(false)
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

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    // Close the modal after submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1e88e5] hover:bg-[#1976d2]">Create Student Record</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus when modal opens
      >
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold text-center text-[#1e88e5] font-poppins">
            Create Student Record
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
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
                    className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                    placeholder="Enter student number"
                    autoFocus={false}
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
                    className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                    placeholder="Enter your first name"
                    autoFocus={false}
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
                    className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                    placeholder="Enter your middle name"
                    autoFocus={false}
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
                    className="h-11 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                    autoFocus={false}
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
                  <SelectTrigger
                    id="course"
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#1e88e5]"
                  >
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

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} className="w-full sm:w-auto bg-[#1e88e5] hover:bg-[#1976d2]">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

