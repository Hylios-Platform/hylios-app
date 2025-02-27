import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Bitcoin, Eye, EyeOff, Loader2 } from "lucide-react";
import { insertUserSchema, type InsertUser } from "@shared/schema";

// Atualizando o schema de validação
const authSchema = insertUserSchema.extend({
  username: z.string()
    .min(3, "auth.errors.usernameMin")
    .max(50, "auth.errors.usernameMax"),
  password: z.string()
    .min(6, "auth.errors.passwordMin")
    .max(50, "auth.errors.passwordMax"),
  email: z.string()
    .email("auth.errors.invalidEmail"),
  age: z.number()
    .min(18, "auth.errors.ageMin")
    .max(100, "auth.errors.ageMax"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "auth.errors.genderRequired" })
  }),
  companyName: z.string().optional()
    .refine((val) => val !== undefined && val !== "" || true, "auth.errors.companyNameRequired"),
});

type RegisterData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { t } = useTranslation();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);
  const [, navigate] = useLocation();

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      age: undefined,
      gender: undefined,
      userType: "professional",
      companyName: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegisterSubmit = (data: RegisterData) => {
    setRegisterData(data);
    setShowConfirmDialog(true);
  };

  const confirmRegister = () => {
    if (registerData) {
      registerMutation.mutate(registerData);
      setShowConfirmDialog(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      <motion.div
        className="flex items-center justify-center p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="w-full max-w-md border-blue-100 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Bitcoin className="h-6 w-6 text-amber-400" />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Hylios
              </span>
            </CardTitle>
            <CardDescription className="text-blue-400">
              {t('home.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="px-4 py-2 text-sm">
                  {t('auth.login')}
                </TabsTrigger>
                <TabsTrigger value="register" className="px-4 py-2 text-sm">
                  {t('auth.register')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.username')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white/80 border-gray-200 text-gray-900"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.password')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showLoginPassword ? "text" : "password"}
                                className="bg-white/80 border-gray-200 text-gray-900 pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                            >
                              {showLoginPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t('auth.login')}
                    </Button>

                    <div className="text-center mt-4">
                      <Link href="/password-reset" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                        {t('auth.forgotPassword')}
                      </Link>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.username')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white/80 border-gray-200 text-gray-900"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.email')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="bg-white/80 border-gray-200 text-gray-900"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.age')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="bg-white/80 border-gray-200 text-gray-900"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.gender')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/80 border-gray-200 text-gray-900">
                                <SelectValue placeholder={t('auth.selectGender')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">{t('auth.genderTypes.male')}</SelectItem>
                              <SelectItem value="female">{t('auth.genderTypes.female')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.password')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showRegisterPassword ? "text" : "password"}
                                className="bg-white/80 border-gray-200 text-gray-900 pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            >
                              {showRegisterPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">{t('auth.iAm')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/80 border-gray-200 text-gray-900">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="professional">
                                {t('auth.professional')}
                              </SelectItem>
                              <SelectItem value="company">
                                {t('auth.company')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {registerForm.watch("userType") === "company" && (
                      <FormField
                        control={registerForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              {t('auth.companyName')} <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white/80 border-gray-200 text-gray-900"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t('auth.register')}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="hidden md:flex flex-col justify-center p-16"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            {t('home.findWork')}
          </h1>
          <p className="text-xl text-blue-400">
            {t('home.description')}
          </p>
        </div>
      </motion.div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <CardHeader>
            <CardTitle>{t('auth.confirmRegistration')}</CardTitle>
            <CardDescription>
              {t('auth.confirmRegistrationDescription')}
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <div>
              <strong>{t('auth.username')}:</strong> {registerData?.username}
            </div>
            <div>
              <strong>{t('auth.email')}:</strong> {registerData?.email}
            </div>
            <div>
              <strong>{t('auth.age')}:</strong> {registerData?.age}
            </div>
            <div>
              <strong>{t('auth.gender')}:</strong> {t(`auth.genderTypes.${registerData?.gender}`)}
            </div>
            <div>
              <strong>{t('auth.userType')}:</strong> {t(`auth.${registerData?.userType}`)}
            </div>
            {registerData?.userType === "company" && (
              <div>
                <strong>{t('auth.companyName')}:</strong> {registerData?.companyName}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={confirmRegister}>
              {t('common.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}