import AuthTestPage from "@/components/testing/auth-test-page";
import { getSessionAction } from "@/lib/actions/test/test-post";

export default async function Page() {
  const { user } = await getSessionAction();

  return <AuthTestPage initialUser={user} />;
}
