import SideNavigation from '@/components/common/SideNavigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='max-w-screen-2xl mx-auto'>
      <div className='flex flex-row min-h-screen'>
        <SideNavigation />
        <main className='ml-[250px] 2xl:ml-[300px] flex-grow p-4 overflow-y-auto bg-gray-100  '>
          {children}
        </main>
      </div>
    </div>
  );
}
