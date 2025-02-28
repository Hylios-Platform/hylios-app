import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { href: "/wallet", label: t('navigation.wallet') },
    { href: "/post-job", label: t('navigation.postJob') },
    { href: "/payments", label: t('navigation.payments') },
    { href: "/settings", label: t('navigation.settings') },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white hover:bg-white/30 transition-all"
        >
          <Menu className="h-7 w-7" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <NavigationMenuLink
                    className={`block px-8 py-5 text-lg font-medium rounded-xl transition-all ${
                      location === item.href
                        ? "bg-primary/90 text-primary-foreground shadow-lg"
                        : "hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </DrawerContent>
    </Drawer>
  );
}