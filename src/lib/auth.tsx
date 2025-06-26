import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
interface DecodedToken {
  user_id: number;
  username: string | null;
  email: string;
  user_type: string;
  exp: number;
}

export const getDecodedToken = (): any | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("access_token")
    console.log(token, "Token---17----")
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        if (decoded.exp * 1000 > Date.now()) {
          return decoded;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
  return null;
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export const isAuthenticated = (): boolean => {
  return getDecodedToken() !== null;
};

const PUBLIC_ROUTES = ["/messdddages", "/dashbddoards", "/signin", "/signup"] as const;

export function isAuth(Component: any) {
  return function ProtectedPage(props: any) {
    /* `isAuthenticated()` returns true/false (⚠️ be sure to CALL the fn) */
    const loggedIn   = isAuthenticated();
    const pathname   = usePathname();
    const router     = useRouter();

    /** Is the current URL in our allow-list? */
    const isPublic = PUBLIC_ROUTES.some(p => pathname.startsWith(p));

    /** Client-side redirect for unauthenticated users on private pages */
    useEffect(() => {
        console.log(loggedIn, "----56")
        console.log(isPublic, "Issdfds57")
      if (!loggedIn && !isPublic) {
        router.replace("/signin");
      }
    }, [loggedIn, isPublic, router]);

    /* Avoid flashing protected content while deciding */
    if (!loggedIn && !isPublic) return null;

    return <Component {...props} />;
  };
}
// export function isAuth(Component: any) {
//   return function IsAuth(props: any) {
//     const auth = isAuthenticated;


//     useEffect(() => {
//       const decoded = getDecodedToken();
//       console.log(decoded, "Decoded----41----")
//       if (!decoded) {
//         // redirect('/signin');
//       }
//     }, []);


//     if (!auth) {
//       return null;
//     }

//     return <Component {...props} />;
//   };
// }



// Custom hook for menu visibility
export const useMenuVisibility = () => {
  const decoded = getDecodedToken();
  console.log(decoded, "Decode TOken----85----")
  const userType = decoded?.roleName?.replace(/\s/g, '_')?.toUpperCase() || 'CUSTOMER';
  console.log(userType, "User Type")
  const menuPermissions = {
    SUPER_ADMIN: [   
    'dashboard', 'overview', 'overview1',
    'assets',        'bledevices', 'fleetview', 'devicelocator',
    'mydevices', 'devices',
    'keypad',        // (the child is also keypad)
    'customers',     'myportfolio', 'payments',
    'team',          'members', 'chat',
    'company',       'request', 'updates',
    'myaccount',     'resetpassword',
    'settings',      // top-level and child
    'debug',         'console', 'reportissue',
    'divider-1', 'divider-2', 'divider-3',
    'logout',],
    DISTRIBUTOR: [   
    'dashboard', 'overview', 'overview1',
    'assets',        'bledevices', 'fleetview', 'devicelocator',
    'mydevices', 'devices',
    'keypad',        // (the child is also keypad)
    'customers',     'myportfolio', 'payments',
    'team',          'members', 'chat',
    'company',       'request', 'updates',
    'myaccount',     'resetpassword',
    'settings',      // top-level and child
    'debug',         'console', 'reportissue',
    'divider-1', 'divider-2', 'divider-3',
    'logout',],
    GENERAL_AGENT: [
    'assets', 'bledevices', 'fleetview', 'devicelocator',
    'keypad',
    'location', 'routes',
    'logout',
    ],
    CUSTOMER: ['keypad'],
  };
  type UserType = keyof typeof menuPermissions;
  const canViewMenu = (menuId: string): boolean => {
    console.log(userType, "User Type")
    console.log(menuId, "The Menu Id.")
    return menuPermissions[userType as keyof typeof menuPermissions]?.includes(menuId) || false;
  };

  return { canViewMenu, userType };
};