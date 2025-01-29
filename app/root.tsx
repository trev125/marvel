import { json, redirect, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  NavLink,
  useNavigation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect } from "react";

import { createEmptyContact, getContacts } from "./data";

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

import "./tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-md h-full flex flex-col">
          <button
            className=" text-left	p-4 text-lg font-semibold text-gray-800 border-b border-gray-200"
            onClick={() => navigate("/")}
          >
            Marvel Companion
          </button>
          <div className="p-4 border-b border-gray-200">
            <Form
              id="search-form"
              role="search"
              className="mb-2"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
            >
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q || ""}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </Form>
            <Form method="post">
              <button
                type="submit"
                className="w-full p-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                New
              </button>
            </Form>
          </div>
          <nav className="flex-grow overflow-y-auto">
            {contacts.length ? (
              <ul className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block p-4 text-sm ${isActive
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-800 hover:bg-gray-100"
                        }`
                      }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.superName ? (
                        <>{contact.superName}</>
                      ) : (
                        <i className="text-gray-500">No Name</i>
                      )}{" "}
                      {contact.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-gray-500 italic">No contacts</p>
            )}
          </nav>
          <footer className="p-4 border-t border-gray-200">
            <span className="text-xs text-gray-500">Remix Contacts</span>
          </footer>
        </div>
        <div
          className={`flex-grow p-4 ${navigation.state === "loading" ? "opacity-50" : ""
            }`}
          id="detail"
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
