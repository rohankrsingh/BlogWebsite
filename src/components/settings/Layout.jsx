import { Link } from "@heroui/link"
import { Outlet, useParams } from 'react-router-dom';
import { Settings, User, UserCog } from "lucide-react"
const sidebarItems = [
    { icon: User, label: "Profile", href: "/settings/profile" },
    { icon: Settings, label: "Customization", href: "/settings/customization" },
    { icon: UserCog, label: "Account", href: "/settings/account" },
];

export default function Layout() {
    const { "*" : currentPath } = useParams();

    return (
        <div className="flex max-w-[1200px] mx-auto p-8 max-md:flex-col max-md:p-2">
            <aside className="w-64 max-md:w-auto">
                <nav className="p-6 space-y-2 items-center max-md:space-x-0 max-md:flex max-md:justify-between max-md:p-2 max-md:overflow-auto">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors ${
                                currentPath === item.href.replace('/settings/', '') 
                                    ? 'bg-muted text-foreground' 
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-6 max-md:p-2"><Outlet /></main>
        </div>
    )

}
