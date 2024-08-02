"use client";

import { Form, Formik } from "formik";
import { object } from "yup";
import React from "react";

import { Button } from "@/components/button";
import { Field } from "@/components";
import { schema } from "@/lib";

type Props = {};

const VolunteerForm = (props: Props) => {
  return (
    <Formik
      validateOnMount
      enableReinitialize
      validationSchema={object({
        name: schema.requireString("Name"),
        email: schema.requireEmail("Email"),
        phone: schema.requirePhoneNumber("Phone Number"),
      })}
      initialValues={{
        name: "",
        email: "",
        phone: "",
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
      }}
    >
      {({ values, isValid, isSubmitting, handleSubmit }) => (
        <Form className="flex flex-col gap-4 w-full">
          <Field.Group required name="name" label="Name" className="">
            <Field.Input
              name="name"
              value={values.name}
              placeholder="Eg: John Doe"
            />
          </Field.Group>

          <Field.Group required name="email" label="Email" className="">
            <Field.Input
              name="email"
              value={values.email}
              placeholder="Eg: johndoe@domain.com"
            />
          </Field.Group>

          <Field.Group required name="phone" label="Phone" className="">
            <Field.Input
              name="phone"
              value={values.phone}
              placeholder="Eg: 0241 234 567"
            />
          </Field.Group>

          <Button
            className="bg-secondary w-max mx-auto"
            type="button"
            disabled={!isValid}
            onClick={() => {
              handleSubmit();
            }}
            {...{ isSubmitting }}
          >
            Join Proffer Aid
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default VolunteerForm;
