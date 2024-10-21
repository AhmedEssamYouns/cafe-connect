import { BASE_URL } from "../config";

const signup = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const login = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + params.id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUserById = async (id) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getRandomUsers = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/random?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + user._id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateAvatar = async (user, avatarFile) => {
  const formData = new FormData();
  formData.append('userId', user._id); // Ensure user._id is valid
  formData.append('avatar', avatarFile); // Ensure avatarFile is a valid file object

  try {
      const res = await fetch(BASE_URL + "api/users/avatar/" + user._id, {
          method: "PATCH",
          headers: {
              "x-access-token": user.token, // Include the user's token for authentication
          },
          body: formData, // Send the FormData object
      });

      if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`); // Throw an error if the response is not ok
      }

      const data = await res.json(); // Await the response to parse JSON
      
      // Show an alert based on the success response
      alert("Avatar updated successfully!");
      return data; // Return the response data
  } catch (err) {
      console.error("Error updating avatar:", err);
      alert(`An error occurred while updating the avatar: ${err.message}`); // Alert on error
      throw err; // Rethrow for handling in the calling function
  }
};



const getAllUsers = async () => {
  try {
    const res = await fetch(BASE_URL + "api/users");
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { signup, login, getUser, getRandomUsers, updateUser, getUserById, getAllUsers,updateAvatar };

