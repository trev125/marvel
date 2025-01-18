/* eslint-disable @typescript-eslint/no-unused-vars -- temp ignoring this since we might get to Forms later */
import { Form, useLoaderData, NavLink } from "@remix-run/react";
import { getContact, updateContact } from "../data";
import type { Character } from "../types/types";

import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

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
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Comics</h2>
        <ul className="list-disc pl-6">
          {comics.items.map((comic) => {
            const comicId = comic.resourceURI.match(/\/(\d+)$/)?.[1];
            return (
              <li key={comic.name}>
                {comicId && (
                  <NavLink to={`/comics/${comicId}`}>{comic.name}</NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Series</h2>
        <ul className="list-disc pl-6">
          {series.items.map((seriesItem) => {
            const seriesId = seriesItem.resourceURI.match(/\/(\d+)$/)?.[1];
            return (
              <li key={seriesItem.name}>
                {seriesId && (
                  <NavLink to={`/series/${seriesId}`}>
                    {seriesItem.name}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Stories</h2>
        <ul className="list-disc pl-6">
          {stories.items.map((story) => {
            const storyId = story.resourceURI.match(/\/(\d+)$/)?.[1];
            return (
              <li key={story.name}>
                {storyId && (
                  <NavLink to={`/stories/${storyId}`}>{story.name}</NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Events</h2>
        <ul className="list-disc pl-6">
          {events.items.map((event) => {
            const eventId = event.resourceURI.match(/\/(\d+)$/)?.[1];
            return (
              <li key={event.name}>
                {eventId && (
                  <NavLink to={`/events/${eventId}`}>{event.name}</NavLink>
                )}
              </li>
            );
          })}
        </ul>
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
