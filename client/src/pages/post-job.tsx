import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJobSchema, type InsertJob } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function PostJob() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      description: "",
      bitcoinAmount: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      const res = await apiRequest("POST", "/api/jobs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully"
      });
      setLocation("/jobs");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Post a New Job
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Job Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Excel Data Analysis" 
                        {...field}
                        className="border-blue-100 focus:border-blue-200 bg-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the job requirements and deliverables"
                        className="min-h-[120px] border-blue-100 focus:border-blue-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bitcoinAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Payment Amount (BTC)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 0.001" 
                        {...field}
                        className="border-blue-100 focus:border-blue-200 bg-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
                disabled={mutation.isPending}
              >
                Post Job
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}