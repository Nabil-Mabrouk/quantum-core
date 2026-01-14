import { signIn } from "@/auth";
import { LogIn, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-lg">QC</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenue sur Quantum Core</h1>
          <p className="text-slate-500 text-sm mt-2">Connectez-vous pour gérer vos projets d'ingénierie.</p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", { email: formData.get("email"), redirectTo: "/dashboard" });
          }}
          className="space-y-4"
        >
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="email"
              type="email"
              placeholder="votre@email.com"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              required
            />
          </div>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Recevoir mon lien d'accès
          </button>
        </form>
        
        <p className="text-[10px] text-slate-400 text-center mt-8 uppercase font-bold tracking-widest leading-relaxed">
          Sécurité industrielle • Accès restreint
        </p>
      </div>
    </div>
  );
}