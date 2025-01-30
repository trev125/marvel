/* eslint-disable @typescript-eslint/no-unused-vars -- temp ignoring this since we might get to Forms later */
import React, { useState } from "react";
import { Form, useLoaderData, NavLink } from "@remix-run/react";
import { getContact, updateContact } from "../data";
import type { Character } from "../types/types";

import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { i } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

/*
 * Everything in the loader() is run on the server even though it is in a client component file.
 * This lets us put secrets (apiKey) directly in here, but they are not leaked in the client bundle.
 * We can utilize this to do server-side data fetching and other server-side operations directly in this file.
 */
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");

  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;
  const hash = process.env.HASH;
  const ts = process.env.TS;

  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  const response = await fetch(
    `${baseUrl}/characters/${contact.id}?apikey=${apiKey}&hash=${hash}&ts=${ts}`,
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    }
  );

  if (!response.ok) {
    throw new Response("Failed to fetch character data", {
      status: response.status,
    });
  }

  const {
    data: { results: characterData },
  }: { data: { results: Character[] } } = await response.json();

  return Response.json({ character: characterData[0] });
};

/*
 * This action is run on the server when the form is submitted.
 * This is where we can update the contact in the database, if we get to that.
 */
export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

/*
 * This is the client-side component that is rendered in the browser.
 * It is hydrated with the data from the loader() function.
 */
export default function Contact() {
  const { character } = useLoaderData<{ character: Character }>();
  const {
    name,
    thumbnail,
    description,
    comics,
    series,
    stories,
    events,
    urls,
  } = character;

  const [activeTab, setActiveTab] = useState("Comics");

  const menuItems = [
    { name: "Comics", data: comics.items },
    { name: "Series", data: series.items },
    { name: "Stories", data: stories.items },
    { name: "Events", data: events.items },
  ];


  return (
    <div
      id="contact"
      className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6"
    >
      <div className="flex items-center">
        <img
          alt={`${name} avatar`}
          key={thumbnail.path}
          src={`${thumbnail.path}/detail.${thumbnail.extension}`}
          className="w-20 h-20 rounded-full border border-gray-300"
        />

        <div className="ml-4 flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            {name ? <>{name}</> : <i>No Name</i>}
          </h1>

          {description ? (
            <p className="text-gray-600 mt-1">{description}</p>
          ) : <i>No Description</i>}
        </div>
      </div>

      {/* Horizontal Navigation Menu */}
      <nav className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-md mt-4">
        {menuItems.map((item, itemIndex) => (
          <button
            key={itemIndex}
            className={`flex-grow p-2 text-sm ${activeTab === item.name
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-800 hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab(item.name)}
          >
            {item.name}
          </button>
        ))}
      </nav>

      {/* Content Section */}
      <div className="mt-6">
        {menuItems.map(
          (item, itemIndex) =>
            activeTab === item.name && (
              <div key={itemIndex}>
                <ul className="list-none pl-6 divide-y divide-gray-200">
                  {item.data.map((entry, entryIndex) => {
                    const id = entry.resourceURI.match(/\/(\d+)$/)?.[1];
                    return (
                      id && (
                        <li key={entryIndex} className="py-2">
                          <NavLink
                            to={`/${item.name.toLowerCase()}/${id}`}
                            className={({ isActive }) =>
                              `text-sm ${isActive
                                ? "text-blue-600 font-semibold"
                                : "text-gray-800 hover:text-blue-500"
                              }`
                            }
                          >
                            {entry.name}
                          </NavLink>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            )
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">External Links</h2>
        <ul>
          {urls.map((url) => (
            <li key={url.type}>
              <a
                href={url.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {url.type.charAt(0).toUpperCase() + url.type.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/**
       * We might get back to this at some point
       */}

      {/* <div className="mt-4 flex gap-4">
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
      </div> */}
    </div>
  );
}
