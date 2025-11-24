import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { CheckCircle2 } from 'lucide-react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export function TwoFactorModal({ isOpen, onClose, onVerify }: TwoFactorModalProps) {
  const [value, setValue] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerified(true);
    setTimeout(() => {
      onVerify();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-[#E0E0E0]">
        {!isVerified ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-black text-center" style={{ fontWeight: 700 }}>
                Two-Factor Authentication
              </DialogTitle>
              <DialogDescription className="text-[#6E6E6E] text-center" style={{ fontWeight: 300 }}>
                Enter the 6-digit code from your authenticator app
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center space-y-6 py-6">
              <InputOTP maxLength={6} value={value} onChange={setValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-[#2E2E2E] text-black" />
                  <InputOTPSlot index={1} className="border-[#2E2E2E] text-black" />
                  <InputOTPSlot index={2} className="border-[#2E2E2E] text-black" />
                  <InputOTPSlot index={3} className="border-[#2E2E2E] text-black" />
                  <InputOTPSlot index={4} className="border-[#2E2E2E] text-black" />
                  <InputOTPSlot index={5} className="border-[#2E2E2E] text-black" />
                </InputOTPGroup>
              </InputOTP>

              <Button
                onClick={handleVerify}
                disabled={value.length !== 6}
                className="w-full bg-black text-white hover:bg-[#1A1A1A]"
                style={{ fontWeight: 600 }}
              >
                Verify
              </Button>

              <button
                className="text-sm text-[#6E6E6E] hover:text-black transition-colors"
                style={{ fontWeight: 500 }}
              >
                Resend code
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="w-20 h-20 text-black mb-4" />
            <h3 className="text-black" style={{ fontWeight: 700 }}>Verification Successful</h3>
            <p className="text-[#6E6E6E] text-center mt-2" style={{ fontWeight: 300 }}>
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
