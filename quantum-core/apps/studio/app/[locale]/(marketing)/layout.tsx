import Link from "next/link";
import { auth, signOut } from "@/auth"; // Import de signOut (version serveur)
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/shell/language-switcher";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="h-20 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-blue-600 transition-colors shadow-lg">
                <span className="text-white font-black text-sm">QC</span>
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">Quantum Core</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Expertise</Link>

            {session ? (
              <div className="flex items-center gap-3">
                {/* BOUTON DASHBOARD (Action principale) */}
                <Link href="/dashboard" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                {/* BOUTON DÉCONNEXION (Action secondaire) */}
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button 
                    type="submit"
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20">
                <LogIn className="w-4 h-4" /> Connexion
              </Link>
            )}
            <div className="scale-90">
                <LanguageSwitcher />
            </div>

          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}