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
  FormDescription,
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
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Bitcoin, Eye, EyeOff, Loader2, Shield, Users, Wallet, Sparkles } from "lucide-react";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import {Checkbox} from "@/components/ui/checkbox";

const authSchema = insertUserSchema.extend({
  username: z.string()
    .min(3, "auth.errors.usernameMin")
    .max(50, "auth.errors.usernameMax"),
  password: z.string()
    .min(8, "auth.errors.passwordMin")
    .max(50, "auth.errors.passwordMax")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "auth.errors.passwordComplexity"),
  confirmPassword: z.string(),
  email: z.string()
    .email("auth.errors.invalidEmail"),
  dateOfBirth: z.string()
    .refine((date) => {
      const age = (new Date().getFullYear() - new Date(date).getFullYear());
      return age >= 18;
    }, "auth.errors.ageMin"),
  country: z.string()
    .min(1, "auth.errors.countryRequired"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    errorMap: () => ({ message: "auth.errors.genderRequired" })
  }),
  document: z.string(),
  companyName: z.string().optional()
    .refine((val) => val !== undefined && val !== "" || true, "auth.errors.companyNameRequired"),
  dataProcessingConsent: z.boolean()
    .refine((val) => val === true, "auth.errors.dataProcessingRequired"),
  marketingConsent: z.boolean(),
  thirdPartyConsent: z.boolean(),
  termsAndConditions: z.boolean()
    .refine((val) => val === true, "auth.errors.termsRequired"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.errors.passwordMatch",
  path: ["confirmPassword"],
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
      confirmPassword: "",
      email: "",
      dateOfBirth: "",
      country: "",
      gender: undefined,
      userType: "professional",
      companyName: "",
      dataProcessingConsent: false,
      marketingConsent: false,
      thirdPartyConsent: false,
      termsAndConditions: false,
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
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20">
      <motion.div
        className="flex items-center justify-center p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md border-blue-50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Bitcoin className="h-6 w-6 text-amber-400" />
              <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Hylios
              </span>
            </CardTitle>
            <CardDescription className="text-blue-400">
              {t('home.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="relative">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">
                  {t('auth.login')}
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">
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
                      className="w-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 hover:from-blue-400 hover:via-blue-500 hover:to-blue-400 text-white shadow-lg transition-all duration-300 backdrop-blur-sm"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t('auth.login')}
                    </Button>

                    <div className="text-center mt-4">
                      <Link href="/password-reset" className="text-sm text-blue-400 hover:text-blue-500 transition-colors">
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
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.dateOfBirth')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
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
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.country')} <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/80 border-gray-200 text-gray-900">
                                <SelectValue placeholder={t('auth.selectCountry')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PT">Portugal</SelectItem>
                              <SelectItem value="ES">España</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                              <SelectItem value="DE">Deutschland</SelectItem>
                              <SelectItem value="IT">Italia</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                              {/* Adicionar mais países da UE */}
                            </SelectContent>
                          </Select>
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
                              <SelectItem value="other">{t('auth.genderTypes.other')}</SelectItem>
                              <SelectItem value="prefer_not_to_say">{t('auth.genderTypes.prefer_not_to_say')}</SelectItem>
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.confirmPassword')} <span className="text-red-500">*</span>
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
                      name="document"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">
                            {t('auth.idDocument')}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white/80 border-gray-200 text-gray-900"
                              {...field}
                              placeholder={t('auth.idDocumentPlaceholder')}
                            />
                          </FormControl>
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

                    <FormField
                      control={registerForm.control}
                      name="dataProcessingConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              {t('auth.dataProcessingConsent')} <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormDescription className="text-xs text-gray-500">
                              {t('auth.dataProcessingDescription')}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="marketingConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              {t('auth.marketingConsent')}
                            </FormLabel>
                            <FormDescription className="text-xs text-gray-500">
                              {t('auth.marketingDescription')}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="thirdPartyConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              {t('auth.thirdPartyConsent')}
                            </FormLabel>
                            <FormDescription className="text-xs text-gray-500">
                              {t('auth.thirdPartyDescription')}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="termsAndConditions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              {t('auth.termsAndConditions')} <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormDescription className="text-xs text-gray-500">
                              {t('auth.termsAndConditionsDescription')}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 hover:from-blue-400 hover:via-blue-500 hover:to-blue-400 text-white shadow-lg transition-all duration-300 backdrop-blur-sm"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t('auth.register')}
                      </Button>

                      <div className="text-center">
                        <span className="text-sm text-gray-500">ou</span>
                      </div>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="hidden md:flex flex-col justify-center p-16 bg-gradient-to-br from-blue-400/5 via-blue-400/10 to-blue-500/5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-md space-y-8">
          <motion.h1
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t('home.findWork')}
          </motion.h1>

          <motion.p
            className="text-xl text-blue-400"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {t('home.description')}
          </motion.p>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <motion.div
              className="p-4 rounded-lg bg-gradient-to-br from-white/80 via-blue-50/30 to-blue-100/20 backdrop-blur-sm border border-blue-100 hover:shadow-md transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">{t('home.features.secure')}</h3>
              <p className="text-sm text-gray-600">Blockchain e criptografia avançada para suas transações</p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-gradient-to-br from-white/80 via-blue-50/30 to-blue-100/20 backdrop-blur-sm border border-blue-100 hover:shadow-md transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Users className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">{t('home.features.verified')}</h3>
              <p className="text-sm text-gray-600">Profissionais e empresas verificados</p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-gradient-to-br from-white/80 via-blue-50/30 to-blue-100/20 backdrop-blur-sm border border-blue-100 hover:shadow-md transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Wallet className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">{t('home.features.instant')}</h3>
              <p className="text-sm text-gray-600">Receba seus pagamentos instantaneamente</p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-gradient-to-br from-white/80 via-blue-50/30 to-blue-100/20 backdrop-blur-sm border border-blue-100 hover:shadow-md transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">IA Matchmaking</h3>
              <p className="text-sm text-gray-600">Sugestões inteligentes de trabalhos baseadas no seu perfil</p>
            </motion.div>
          </div>
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
              <strong>{t('auth.dateOfBirth')}:</strong> {registerData?.dateOfBirth}
            </div>
            <div>
              <strong>{t('auth.gender')}:</strong> {t(`auth.genderTypes.${registerData?.gender}`)}
            </div>
            <div>
              <strong>{t('auth.country')}:</strong> {registerData?.country}
            </div>
            <div>
              <strong>{t('auth.userType')}:</strong> {t(`auth.${registerData?.userType}`)}
            </div>
            {registerData?.userType === "company" && (
              <div>
                <strong>{t('auth.companyName')}:</strong> {registerData?.companyName}
              </div>
            )}
            <div>
              <strong>{t('auth.document')}:</strong> {registerData?.document}
            </div>
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