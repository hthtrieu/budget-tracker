"use client";

import React from "react";

const Container = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const onGetUsersListApi = () => {
    fetch("/api/user")
      .then((response: Response) => {
        if (response.status === 200) {
          return response.json(); // Parse JSON
        }
        throw new Error("Failed to fetch users");
      })
      .then((data) => setUsers(data.users))
      .catch((error) => console.error(error)); // Log lỗi nếu có
  };
  React.useEffect(() => {
    onGetUsersListApi();
  }, []);
  return (
    <div>
      <h1>Get All Users API</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Container;
