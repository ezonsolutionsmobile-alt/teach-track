/**
 * Converts a route name to a user-friendly tab label.
 * Example:
 * "HomeScreen" -> "Home"
 * "ProfileScreen" -> "Profile"
 * "HomeStack" -> "Home"
 */
export const getTabLabel = (routeName) => {
  if (!routeName) return '';

  return routeName
    .replace(/(Screen|Stack)$/, '') // remove Screen or Stack from end
    .replace(/([A-Z])/g, ' $1')     // add space before capital letters
    .trim();
};
