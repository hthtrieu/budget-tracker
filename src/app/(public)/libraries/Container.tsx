"use client";
import { FormInput } from "@/components/common/form/FormInput";
import { Constants } from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
export const Libraries = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitValues, setSubmitValues] = useState<FormData | null>(null);

  // Define schema using Zod
  const formSchema = z.object({
    username: z.string().min(2, { message: "Required" }),
    password: z.string().min(6, { message: "Required" }),
    age: z.number({ required_error: "Required" }),
    agree: z.boolean().optional(),
    description: z.string().optional(),
    gender: z.enum(["1", "0"], { required_error: "Required" }), // Enum for stricter validation
  });

  // Infer form data type from Zod schema
  type FormData = z.infer<typeof formSchema>;

  // Initialize React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "username",
      password: "password",
      age: 1,
      agree: false,
      gender: "1",
    },
  });

  // Submit handler
  const submitForm: SubmitHandler<FormData> = (values) => {
    setSubmitValues(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <div className="flex gap-4 flex-wrap">
          {/* Username Input */}
          <FormInput
            control={form.control}
            fieldName="username"
            type={Constants.INPUT_TYPE.TEXT}
            label="User name"
            placeholder="Enter user name"
            required={true}
          />

          {/* Password Input */}
          <FormInput
            control={form.control}
            fieldName="password"
            type={
              showPassword
                ? Constants.INPUT_TYPE.TEXT
                : Constants.INPUT_TYPE.PASSWORD
            }
            label="Password"
            placeholder="Enter your password"
            icon={showPassword ? <EyeClosedIcon /> : <EyeIcon />}
            alignIcon="right"
            onClickIcon={() => {
              setShowPassword(!showPassword);
            }}
          />

          {/* Age Select */}
          <FormInput
            control={form.control}
            fieldName="age"
            type={Constants.INPUT_TYPE.SELECT}
            label="Age"
            options={[
              { key: 1, label: "1" },
              { key: 2, label: "2" },
            ]}
          />

          {/* Checkbox for Agreement */}
          <FormInput
            control={form.control}
            fieldName="agree"
            type={Constants.INPUT_TYPE.CHECKBOX}
            labelCheckbox="Agree with terms"
          />

          {/* Description Textarea */}
          <FormInput
            control={form.control}
            fieldName="description"
            type={Constants.INPUT_TYPE.TEXTAREA}
            label="Description"
            placeholder="Describe yourself"
          />

          {/* Gender Radio */}
          <FormInput
            control={form.control}
            fieldName="gender"
            type={Constants.INPUT_TYPE.RADIO}
            label="Gender"
            options={[
              { key: "1", label: "Female" },
              { key: "0", label: "Male" },
            ]}
          />

          <Button type="submit" variant="default">
            Submit
          </Button>
        </div>
      </form>

      {/* Display submitted values */}
      {submitValues && (
        <div>
          <h3>Submit values:</h3>
          <p>Username: {submitValues.username}</p>
          <p>Password: {submitValues.password}</p>
          <p>Age: {submitValues.age}</p>
          <p>Description: {submitValues.description}</p>
          <p>Agree: {submitValues.agree ? "Yes" : "No"}</p>
          <p>Gender: {submitValues.gender === "1" ? "Female" : "Male"}</p>
        </div>
      )}
    </Form>
  );
};
