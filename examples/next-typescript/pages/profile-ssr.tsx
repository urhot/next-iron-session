import React from "react";
import Layout from "../components/Layout";
import withSession, { NextIronRequest } from "../lib/session";
import PropTypes from "prop-types";
import { NextApiResponse } from "next";
import { UserProps } from "../lib/user";

const SsrProfile = ({ user, locale }: UserProps & { locale: string }) => {
  return (
    <Layout>
      <h1>Your GitHub profile</h1>
      <h2>
        This page uses{" "}
        <a href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
          Server-side Rendering (SSR)
        </a>{" "}
        and{" "}
        <a href="https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering">
          getServerSideProps
        </a>
      </h2>

      {user?.isLoggedIn && (
        <>
          <p style={{ fontStyle: "italic" }}>
            Public data, from{" "}
            <a href={githubUrl(user.login)}>{githubUrl(user.login)}</a>, reduced
            to `login` and `avatar_url`.
          </p>
          <pre>{JSON.stringify(user, undefined, 2)}</pre>
        </>
      )}

      <div>
        locale: <code>{ locale ?? 'not set!' }</code>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSession<{ props: UserProps | {} }>(
  async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
    const user = req.session.get("user");

    console.log('locale provided to getServerSideProps: ' + locale);

    if (user === undefined) {
      res.setHeader("location", "/login");
      res.statusCode = 302;
      res.end();
      return { props: { locale: locale } };
    }

    return {
      props: {
        user: user,
        locale: locale,
      },
    };
  },
);

export default SsrProfile;

function githubUrl(login) {
  return `https://api.github.com/users/${login}`;
}

SsrProfile.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
};
