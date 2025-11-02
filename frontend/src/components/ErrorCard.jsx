"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorCard = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.", 
  buttonText = "Go back to login", 
  onRetry 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[90%] max-w-md shadow-lg rounded-2xl p-4 text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onRetry ? onRetry : () => navigate("/login")}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorCard;
