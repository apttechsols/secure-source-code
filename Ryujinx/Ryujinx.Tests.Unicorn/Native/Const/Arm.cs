// Constants for Unicorn Engine. AUTO-GENERATED FILE, DO NOT EDIT

// ReSharper disable InconsistentNaming
namespace Ryujinx.Tests.Unicorn.Native.Const
{
    public enum Arm
    {

        // ARM CPU

        CPU_ARM_926 = 0,
        CPU_ARM_946 = 1,
        CPU_ARM_1026 = 2,
        CPU_ARM_1136_R2 = 3,
        CPU_ARM_1136 = 4,
        CPU_ARM_1176 = 5,
        CPU_ARM_11MPCORE = 6,
        CPU_ARM_CORTEX_M0 = 7,
        CPU_ARM_CORTEX_M3 = 8,
        CPU_ARM_CORTEX_M4 = 9,
        CPU_ARM_CORTEX_M7 = 10,
        CPU_ARM_CORTEX_M33 = 11,
        CPU_ARM_CORTEX_R5 = 12,
        CPU_ARM_CORTEX_R5F = 13,
        CPU_ARM_CORTEX_A7 = 14,
        CPU_ARM_CORTEX_A8 = 15,
        CPU_ARM_CORTEX_A9 = 16,
        CPU_ARM_CORTEX_A15 = 17,
        CPU_ARM_TI925T = 18,
        CPU_ARM_SA1100 = 19,
        CPU_ARM_SA1110 = 20,
        CPU_ARM_PXA250 = 21,
        CPU_ARM_PXA255 = 22,
        CPU_ARM_PXA260 = 23,
        CPU_ARM_PXA261 = 24,
        CPU_ARM_PXA262 = 25,
        CPU_ARM_PXA270 = 26,
        CPU_ARM_PXA270A0 = 27,
        CPU_ARM_PXA270A1 = 28,
        CPU_ARM_PXA270B0 = 29,
        CPU_ARM_PXA270B1 = 30,
        CPU_ARM_PXA270C0 = 31,
        CPU_ARM_PXA270C5 = 32,
        CPU_ARM_MAX = 33,
        CPU_ARM_ENDING = 34,

        // ARM registers

        REG_INVALID = 0,
        REG_APSR = 1,
        REG_APSR_NZCV = 2,
        REG_CPSR = 3,
        REG_FPEXC = 4,
        REG_FPINST = 5,
        REG_FPSCR = 6,
        REG_FPSCR_NZCV = 7,
        REG_FPSID = 8,
        REG_ITSTATE = 9,
        REG_LR = 10,
        REG_PC = 11,
        REG_SP = 12,
        REG_SPSR = 13,
        REG_D0 = 14,
        REG_D1 = 15,
        REG_D2 = 16,
        REG_D3 = 17,
        REG_D4 = 18,
        REG_D5 = 19,
        REG_D6 = 20,
        REG_D7 = 21,
        REG_D8 = 22,
        REG_D9 = 23,
        REG_D10 = 24,
        REG_D11 = 25,
        REG_D12 = 26,
        REG_D13 = 27,
        REG_D14 = 28,
        REG_D15 = 29,
        REG_D16 = 30,
        REG_D17 = 31,
        REG_D18 = 32,
        REG_D19 = 33,
        REG_D20 = 34,
        REG_D21 = 35,
        REG_D22 = 36,
        REG_D23 = 37,
        REG_D24 = 38,
        REG_D25 = 39,
        REG_D26 = 40,
        REG_D27 = 41,
        REG_D28 = 42,
        REG_D29 = 43,
        REG_D30 = 44,
        REG_D31 = 45,
        REG_FPINST2 = 46,
        REG_MVFR0 = 47,
        REG_MVFR1 = 48,
        REG_MVFR2 = 49,
        REG_Q0 = 50,
        REG_Q1 = 51,
        REG_Q2 = 52,
        REG_Q3 = 53,
        REG_Q4 = 54,
        REG_Q5 = 55,
        REG_Q6 = 56,
        REG_Q7 = 57,
        REG_Q8 = 58,
        REG_Q9 = 59,
        REG_Q10 = 60,
        REG_Q11 = 61,
        REG_Q12 = 62,
        REG_Q13 = 63,
        REG_Q14 = 64,
        REG_Q15 = 65,
        REG_R0 = 66,
        REG_R1 = 67,
        REG_R2 = 68,
        REG_R3 = 69,
        REG_R4 = 70,
        REG_R5 = 71,
        REG_R6 = 72,
        REG_R7 = 73,
        REG_R8 = 74,
        REG_R9 = 75,
        REG_R10 = 76,
        REG_R11 = 77,
        REG_R12 = 78,
        REG_S0 = 79,
        REG_S1 = 80,
        REG_S2 = 81,
        REG_S3 = 82,
        REG_S4 = 83,
        REG_S5 = 84,
        REG_S6 = 85,
        REG_S7 = 86,
        REG_S8 = 87,
        REG_S9 = 88,
        REG_S10 = 89,
        REG_S11 = 90,
        REG_S12 = 91,
        REG_S13 = 92,
        REG_S14 = 93,
        REG_S15 = 94,
        REG_S16 = 95,
        REG_S17 = 96,
        REG_S18 = 97,
        REG_S19 = 98,
        REG_S20 = 99,
        REG_S21 = 100,
        REG_S22 = 101,
        REG_S23 = 102,
        REG_S24 = 103,
        REG_S25 = 104,
        REG_S26 = 105,
        REG_S27 = 106,
        REG_S28 = 107,
        REG_S29 = 108,
        REG_S30 = 109,
        REG_S31 = 110,
        REG_C1_C0_2 = 111,
        REG_C13_C0_2 = 112,
        REG_C13_C0_3 = 113,
        REG_IPSR = 114,
        REG_MSP = 115,
        REG_PSP = 116,
        REG_CONTROL = 117,
        REG_IAPSR = 118,
        REG_EAPSR = 119,
        REG_XPSR = 120,
        REG_EPSR = 121,
        REG_IEPSR = 122,
        REG_PRIMASK = 123,
        REG_BASEPRI = 124,
        REG_BASEPRI_MAX = 125,
        REG_FAULTMASK = 126,
        REG_APSR_NZCVQ = 127,
        REG_APSR_G = 128,
        REG_APSR_NZCVQG = 129,
        REG_IAPSR_NZCVQ = 130,
        REG_IAPSR_G = 131,
        REG_IAPSR_NZCVQG = 132,
        REG_EAPSR_NZCVQ = 133,
        REG_EAPSR_G = 134,
        REG_EAPSR_NZCVQG = 135,
        REG_XPSR_NZCVQ = 136,
        REG_XPSR_G = 137,
        REG_XPSR_NZCVQG = 138,
        REG_CP_REG = 139,
        REG_ENDING = 140,

        // alias registers
        REG_R13 = 12,
        REG_R14 = 10,
        REG_R15 = 11,
        REG_SB = 75,
        REG_SL = 76,
        REG_FP = 77,
        REG_IP = 78,
    }
}
