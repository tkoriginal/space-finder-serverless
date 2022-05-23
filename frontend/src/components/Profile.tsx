import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, UserAttribute } from "../model/Model";
import { AuthService } from "../services/AuthService";

// interface ProfileState {
//   userAttributes: UserAttribute[];
// }
interface ProfileProps {
  user: User | undefined;
  authService: AuthService;
}

const Profile: FC<ProfileProps> = ({ user, authService }) => {
  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);

  useEffect(() => {
    const getUserAttributes = async (user: User) => {
      setUserAttributes(await authService.getUserAttributes(user));
    };
    if (user) {
      getUserAttributes(user);
    }
  }, [authService, user]);

  const renderUserAttributes = () => {
    return (
      <table>
        <tbody>
          {userAttributes.map((userAttribute) => (
            <tr key={userAttribute.Name}>
              <td>{userAttribute.Name}</td>
              <td>{userAttribute.Value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (user) {
      return (<div>
          Welcome to the profile page
          <div>
          <h3>Hello {user.userName}</h3>
          Here are your attributes:
          {renderUserAttributes()}
        </div>
      </div>)
  } else {
      return <div>
      Welcome ti the profile page!
      <div>
          Please <Link to="login">Login</Link>
        </div>
    </div>
  }

};

export default Profile
