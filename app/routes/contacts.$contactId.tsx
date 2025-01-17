import { Form, json, useLoaderData, useFetcher } from "@remix-run/react";
import type { FunctionComponent } from "react";

import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";

import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
// existing imports
import invariant from "tiny-invariant";

// existing imports

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div
      id="contact"
      className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6"
    >
      <div className="flex items-center">
        <img
          alt={`${contact.superName} avatar`}
          key={contact.avatar}
          src={contact.avatar}
          className="w-20 h-20 rounded-full border border-gray-300"
        />

        <div className="ml-4 flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            {contact.superName ? <>{contact.superName}</> : <i>No Name</i>}
            <Favorite contact={contact} />
          </h1>

          {contact.first || contact.last ? (
            <p className="text-blue-600">
              <a
                href={contact.url}
                target="_blank"
                className="hover:underline"
                rel="noreferrer"
              >
                {contact.first} {contact.last}
              </a>
            </p>
          ) : null}

          {contact.notes ? (
            <p className="text-gray-600 mt-1">{contact.notes}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <Form action="edit">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Edit
          </button>
        </Form>
        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm(
              "Please confirm you want to delete this record."
            );
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
        className={`text-xl ${favorite ? "text-yellow-400" : "text-gray-400"}`}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
