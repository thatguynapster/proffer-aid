"use client";

import { Form, Formik } from "formik";
import { object } from "yup";
import React from "react";

import { Button } from "@/components/button";
import { Field } from "@/components";
import { schema } from "@/lib";

type Props = {};

const ContactForm = (props: Props) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          name: schema.requireString("Name"),
          email: schema.requireEmail("Email"),
          subject: schema.requireEmail("Subject"),
          message: schema.requireString("Message"),
        })}
        initialValues={{
          name: "",
          email: "",
          message: "",
          subject: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
        }}
      >
        {({ values, isValid, isSubmitting, handleSubmit }) => (
          <Form className="flex flex-col gap-4 w-full">
            <h1 className="capitalize text-3xl font-semibold mb-4">
              How can we help?
            </h1>

            <Field.Group required name="name" label="Name" className="">
              <Field.Input name="name" value={values.name} placeholder="Name" />
            </Field.Group>

            <Field.Group required name="email" label="Email" className="">
              <Field.Input
                name="email"
                value={values.email}
                placeholder="Email"
              />
            </Field.Group>

            <Field.Group required name="subject" label="Subject" className="">
              <Field.Input
                name="subject"
                value={values.subject}
                placeholder="Subject"
              />
            </Field.Group>

            <Field.Group
              name="message"
              label="Message"
              required
              className="h-max"
              as="textarea"
            >
              <Field.Input
                as="textarea"
                rows={4}
                name="message"
                value={values.message}
                placeholder="Message"
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
              Send message
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
