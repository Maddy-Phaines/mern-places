import UsersList from "../components/usersList";

const USERS = [
  {
    id: "u1",
    name: "Maddy Haines",
    image:
      "https://images.pexels.com/photos/14270758/pexels-photo-14270758.jpeg",
    places: 3,
  },
  {
    id: "u2",
    name: "Jenny Mayne",
    image:
      "https://images.pexels.com/photos/14270758/pexels-photo-14270758.jpeg",
    places: 2,
  },
];

const Users = () => {
  return <UsersList items={USERS} />;
};

export default Users;
