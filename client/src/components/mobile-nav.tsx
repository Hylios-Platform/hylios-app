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
    { href: "/jobs", label: t('navigation.jobs') },
    { href: "/post-job", label: t('navigation.postJob') },
    { href: "/payments", label: t('navigation.payments') },
    { href: "/pitch", label: t('navigation.pitch') },
    { href: "/settings", label: t('navigation.settings') },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <NavigationMenuLink
                    className={`block px-4 py-2 text-sm rounded-md ${
                      location === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
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
