// @flow strict
import React from "react";
import { getContactHref } from "../../../utils";
import styles from "./Author.module.scss";
import { useSiteMetadata } from "../../../hooks";

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles["author"]}>
      <p className={styles["author__bio"]}>
        {author.bio}
        <br />
        <a
          className={styles["author__bio-instagram"]}
          href={getContactHref("instagram", author.contacts.instagram)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <strong>{author.name}</strong> on Instagram
        </a>
      </p>
    </div>
  );
};

export default Author;
