const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/context/AuthContext.tsx', 'utf8');
file = file.replace(/, signupApi/, '');
file = file.replace(/signupApi, /, '');
file = file.replace(/  signup: \(name: string, email: string, password: string, role\?: string\) => Promise<boolean>\n/, '');
file = file.replace(/  const signup = useCallback\(async \(name: string, email: string, password: string, role\?: string\): Promise<boolean> => \{\n.*?  \}, \[\]\)\n/s, '');
file = file.replace(/    signup,\n/, '');
fs.writeFileSync('uniquecare/frontend/src/context/AuthContext.tsx', file);
