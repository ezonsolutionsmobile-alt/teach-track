export const compareVersions = (currentVersion, minimumVersion) => {
  const current = currentVersion.split('.').map(Number);
  const minimum = minimumVersion.split('.').map(Number);

  const length = Math.max(current.length, minimum.length);

  for (let i = 0; i < length; i++) {
    const currentPart = current[i] || 0;
    const minimumPart = minimum[i] || 0;

    if (currentPart < minimumPart) {
      return -1;
    }

    if (currentPart > minimumPart) {
      return 1;
    }
  }

  return 0;
};