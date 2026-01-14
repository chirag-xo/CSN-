import bcrypt from 'bcryptjs';
import prisma from './src/shared/database';

async function resetPassword() {
    const email = 'jane@example.com';
    const newPassword = 'test123';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in database
    const updated = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
        select: { email: true, firstName: true, lastName: true }
    });

    console.log('✅ Password reset successful!');
    console.log('User:', updated.firstName, updated.lastName);
    console.log('Email:', updated.email);
    console.log('New Password:', newPassword);

    await prisma.$disconnect();
}

resetPassword().catch((error) => {
    console.error('Error resetting password:', error);
    process.exit(1);
});
