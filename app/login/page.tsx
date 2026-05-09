import { LockKeyhole, RadioTower, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { e2eEmail, getCommandSession } from "@/auth";
import { signInWithE2ETest, signInWithGoogle } from "@/features/security/google-authentication/actions";
import { Panel, SectionLabel } from "@/components/ui/panel";

type LoginSearchParams = {
  callbackUrl?: string;
  error?: string;
};

function getErrorMessage(error?: string) {
  if (!error) return null;

  if (error === "AccessDenied") {
    return "This Google account is not cleared for Shogun Command.";
  }

  return "Authentication could not be completed. Try again with an allowed Google account.";
}

function safeCallbackUrl(callbackUrl?: string) {
  return callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/";
}

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<LoginSearchParams>;
}) {
  const session = await getCommandSession();
  const params = (await searchParams) ?? {};
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const errorMessage = getErrorMessage(params.error);
  const e2eAuthEnabled = process.env.E2E_TEST_AUTH === "true";

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded border border-bridge-violet/40 bg-bridge-panel text-2xl font-black shadow-violet">
            SC
          </div>
          <div className="mt-6">
            <SectionLabel>Secure Command Route</SectionLabel>
          </div>
          <h1 className="mt-3 text-4xl font-black text-white">Shogun Command</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Authenticate with an approved Google account before entering mission control.
          </p>
        </div>

        <Panel tone="blue" className="space-y-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-bridge-mint" />
            <div>
              <SectionLabel>Identity Check</SectionLabel>
              <h2 className="text-2xl font-black text-white">Google Login</h2>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded border border-bridge-danger/40 bg-bridge-danger/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          <form action={signInWithGoogle}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md border border-bridge-bright bg-bridge-bright/15 px-4 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-bridge-bright/25"
            >
              <LockKeyhole className="h-5 w-5" />
              Continue With Google
            </button>
          </form>

          {e2eAuthEnabled ? (
            <form action={signInWithE2ETest} className="space-y-3">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
                Test account email
                <input
                  name="email"
                  type="email"
                  defaultValue={e2eEmail}
                  className="mt-2 w-full rounded border border-bridge-line bg-black/30 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none transition focus:border-bridge-mint"
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-md border border-bridge-mint bg-bridge-mint/10 px-4 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-bridge-mint/20"
              >
                <LockKeyhole className="h-5 w-5" />
                Continue With Test Login
              </button>
            </form>
          ) : null}

          <div className="flex items-center gap-2 border-t border-bridge-line/70 pt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <RadioTower className="h-4 w-4 text-bridge-bright" />
            Pages and command APIs are locked until authentication succeeds.
          </div>
        </Panel>
      </div>
    </main>
  );
}
