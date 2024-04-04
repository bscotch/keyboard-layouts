#include <windows.h>
#include <iostream>

// Get the current keyboard layout via GetKeyboardLayoutNameA

int main()
{
    char layoutName[KL_NAMELENGTH];
    if (GetKeyboardLayoutNameA(layoutName))
    {
        std::cout << "Current keyboard layout: " << layoutName << std::endl;
    }
    else
    {
        std::cerr << "Failed to get the current keyboard layout" << std::endl;
    }
    return 0;
}
