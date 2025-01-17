import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form
      key={contact.id}
      id="contact-form"
      method="post"
      className="max-w-3xl mx-auto mt-8 bg-white p-6 shadow-md rounded-lg"
    >
      <div className="mb-4 flex items-center">
        <label
          htmlFor="first-name"
          className="w-24 text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <div className="flex flex-1 gap-4">
          <input
            id="first-name"
            aria-label="First name"
            defaultValue={contact.first}
            name="first"
            placeholder="First"
            type="text"
            className="flex-1 rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            aria-label="Last name"
            defaultValue={contact.last}
            name="last"
            placeholder="Last"
            type="text"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mb-4 flex items-center ">
        <label
          htmlFor="superName"
          className="w-24 text-sm font-medium text-gray-700"
        >
          Super Hero Name
        </label>
        <input
          id="superName"
          defaultValue={contact.superName}
          name="superName"
          placeholder="@jack"
          type="text"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4 flex items-center ">
        <label
          htmlFor="avatar"
          className="w-24 text-sm font-medium text-gray-700"
        >
          Avatar URL
        </label>
        <input
          id="avatar"
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6 flex items-start">
        <label
          htmlFor="notes"
          className="w-24 text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          defaultValue={contact.notes}
          name="notes"
          rows={6}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
