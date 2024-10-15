"use client";

import styles from "@/app/styles/watchlistMain.module.scss";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

interface EditableListTitleProps {
  listId: string;
  userUid: string;
  initialTitle: string;
  onUpdateSuccess?: () => void;
  onUpdateError?: (error: Error) => void;
}

export default function EditableListTitle({
  listId,
  userUid,
  initialTitle,
  onUpdateSuccess,
  onUpdateError,
}: EditableListTitleProps) {
  // console.log("onUpdateSuccess:", onUpdateSuccess);
  // console.log("onUpdateError:", onUpdateError);

  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleBlur = async () => {
    console.log(title.trim());
    if (!title.trim()) {
      setTitle(initialTitle);
    } else {
      if (!isUpdating) {
        await updateListTitle();
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(initialTitle);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const updateListTitle = async () => {
    if (title.trim() === initialTitle || isUpdating) return;
    console.log("Current Title:", title.trim());
    console.log("Initial Title:", initialTitle);
    setIsUpdating(true);

    try {
      const listRef = doc(db, "users", userUid, "lists", listId);
      await updateDoc(listRef, { title: title.trim() });
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error("Error updating title: ", error);

      setTitle(initialTitle);
      // if (onUpdateError) onUpdateError(error); 用下面這段取代這句
      if (onUpdateError) {
        if (error instanceof Error) {
          onUpdateError(error);
        } else {
          onUpdateError(new Error("Unknown error occurred"));
        }
      }

      setTitle(initialTitle);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <h2
      onClick={() => setIsEditing(true)}
      className={styles.listContainer__header__title}
    >
      {isEditing ? (
        <input
          autoFocus
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.listContainer__header__title__editing}
        />
      ) : (
        title
      )}
    </h2>
    // <h2
    //   contentEditable={isEditing}
    //   suppressContentEditableWarning={true}
    //   onBlur={handleBlur}
    //   onClick={() => setIsEditing(true)}
    //   onKeyDown={handleKeyDown}
    //   className={styles.listContainer__header__title}
    // >
    //   {title}
    // </h2>
  );
}
