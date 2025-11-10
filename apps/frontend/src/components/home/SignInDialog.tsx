import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InputOTP, InputOTPSlot, InputOTPGroup } from "../ui/input-otp";
import { sendEmailOtp, verifyEmailOtp } from "@/api/client";
import { Loader2 } from "lucide-react";

export const SignInDialog = ({
  signInWithGoogle,
  trigger,
}: {
  signInWithGoogle: () => void | Promise<void>;
  trigger?: React.ReactNode;
}) => {
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOTPSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);

    try {
      await sendEmailOtp(email);
      setOTP(true);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    if (!value.trim()) return;
    setLoading(true);


    const data = await verifyEmailOtp(email.trim(), value.trim());

    if (data.session) {
      window.location.href = '/generator';
    }


  };

  return (
    // Reset OTP state when dialog opens
    <Dialog onOpenChange={(open) => {
      if (open) {
        setOTP(false);
        setValue("");
        setLoading(false);
      }
    }}>
      <DialogTrigger asChild>{trigger ?? <Button variant="default">Try it now</Button>}</DialogTrigger>

      <DialogContent className={`border border-border gap-2 shadow-lg shadow-black/10 ${OTP ? 'h-45' : 'h-60'}`}>
        <DialogHeader>
          <DialogTitle>{`${OTP ? "Verify OTP" : "Sign In"}`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            {OTP ? ("Enter the one-time password sent to your email to continue.") : ("Sign in with your email to continue.")}
        </DialogDescription>

        <div className={`flex flex-col gap-4 mt-2 ${OTP ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-row gap-3">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button
              variant="outline"
              className="border-border text-foreground flex items-center justify-center"
              onClick={handleOTPSubmit}
              disabled={loading || !email.trim()}
            >
              {loading ? <Loader2 className="animate-spin size-4" /> : "Continue"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Button variant="secondary" className="w-full" onClick={signInWithGoogle}>
            <div className="flex flex-row items-center justify-center gap-0">
              <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </div>
          </Button>
        </div>

        <div className={`flex flex-col gap-4 items-center mt-2 transition-opacity duration-300 ${OTP ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-6">
            <div className="min-w-0">
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(v) => setValue(v)}
                className="text-md"
              >
                <InputOTPGroup className="flex items-center">
                  <InputOTPSlot index={0} className="w-11 h-11 text-lg !active:ring-0" />
                  <InputOTPSlot index={1} className="w-11 h-11 text-lg" />
                  <InputOTPSlot index={2} className="w-11 h-11 text-lg" />
                  <InputOTPSlot index={3} className="w-11 h-11 text-lg" />
                  <InputOTPSlot index={4} className="w-11 h-11 text-lg" />
                  <InputOTPSlot index={5} className="w-11 h-11 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="shrink-0">
              <Button
                onClick={handleOTPVerify}
                disabled={value.length < 6}
              >
                {loading ? <Loader2 className="animate-spin size-4" /> : "Submit"}
              </Button>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};