import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(newEmail)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error(msg);
      return;
    }
    
    if (newEmail !== confirmEmail) {
      const msg = "Emails do not match.";
      setError(msg);
      toast.error(msg);
      return;
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail });
    
    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      setDone(true);
      toast.success("Email update initiated. Please check both your old and new email for confirmation.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-muted">
      {!done ? (
        <form onSubmit={handleUpdate} className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow w-80 max-w-[90vw] space-y-6">
          <h1 className="text-2xl font-semibold text-center mb-8">Change Email</h1>
          
          <div className="flex flex-col w-full items-start gap-1">
            <p className="text-sm">New Email</p>
            <Input 
              type="email" 
              placeholder="New Email" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)} 
            />
          </div>
          
          <div className="flex flex-col w-full items-start gap-1">
            <p className="text-sm">Confirm Email</p>
            <Input 
              type="email" 
              placeholder="Confirm Email" 
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)} 
            />
          </div>
          
          <Button type="submit" className="w-full">Update Email</Button>
        </form>
      ) : (
        <div className="text-center space-y-3 bg-card p-8 rounded-xl shadow max-w-md">
          <h2 className="flex items-center justify-center gap-4 text-2xl font-semibold mb-4">
            Email Update Initiated <CircleCheckBig size={28} />
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Please check your email inbox to confirm the change. You may need to verify both your old and new email addresses.
          </p>
          <Button onClick={() => navigate("/app/settings")}>Return to Settings</Button>
        </div>
      )}
    </div>
  );
}