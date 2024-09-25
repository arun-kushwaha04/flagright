import { performAPICall } from '@/libs/axios';
import { banksInfo, requestType, usersTransaction } from '@/libs/endpionts';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export enum TransactionState {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export enum UserType {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL',
}

export enum TransactionType {
  WITHDRAWL = 'WITHDRAWL',
  TRANSFER = 'TRANSFER',
  SELFTRANSFER = 'SELFTRANSFER',
}

export enum Currency {
  USD = 'USD',
  INR = 'INR',
  RUB = 'RUB',
  JPY = 'JPY',
  EUR = 'EUR',
  CNY = 'CNY',
}

interface BankInfo {
  balance: number;
  bank: { id: number; currency: Currency; name: string };
}

interface Transaction {
  id: number;
  originId: number;
  destinationId: number;
  originAmount: number;
  originAmountCurrency: Currency;
  originBankId: number;
  destinationAmount: number;
  destinationAmountCurrency: Currency;
  destinationBankId: number | null;
  description: string;
  type: TransactionType;
  state: TransactionState;
  createdAt: string;
  updatedAt: string;
}

const getUserBankInfo = async (
  setBankInfo: Dispatch<SetStateAction<BankInfo[]>>,
) => {
  const data: {
    success: boolean;
    payload?: BankInfo[];
    message?: string;
  } = await performAPICall(
    banksInfo,
    requestType.GET,
    {},
    {
      success: {
        show: false,
      },
      error: {
        show: true,
        message: 'Failed to retrieve bank account information',
      },
      info: {
        show: false,
      },
    },
  );

  if (data.success) setBankInfo(data.payload!);
  else setBankInfo([]);
};

export default function Dashboard() {
  const [userBankInfo, setUserBankInfo] = useState<BankInfo[]>([]);
  useEffect(() => {
    getUserBankInfo(setUserBankInfo);
  }, []);
  return (
    <Container fixed>
      <Box component="section">
        <Typography variant="h4">User Dashboard</Typography>
      </Box>
      <BanksTable banks={userBankInfo} />
      <TransactionTable />
    </Container>
  );
}

const BanksTable = (props: { banks: BankInfo[] }) => {
  return (
    <Box component="section">
      <Typography variant="subtitle1">Account Info</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bank Name</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.banks.map((bank) => (
              <TableRow key={bank.bank.id}>
                <TableCell>{bank.bank.name}</TableCell>
                <TableCell>{bank.balance.toLocaleString()}</TableCell>
                <TableCell>{bank.bank.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const TransactionTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    allTransactionFilter: { toFilter: false },
    originBankIdFilter: { toFilter: false },
    destinationIdFilter: { toFilter: false },
    destinationBankIdFilter: { toFilter: false },
    descriptionFilter: { toFilter: false },
    currencyFilter: { toFilter: false },
    dateFilter: { toFilter: false },
    statusFilter: { toFilter: false },
    typeFilter: { toFilter: false },
    amountFilter: { toFilter: false },
  });

  const fetchTransactions = async (page: number) => {
    const data: {
      success: boolean;
      message?: string;
      payload?: {
        pageNumber: number;
        itemPerPage: number;
        totalPage: number;
        transactions: Transaction[];
      };
    } = await performAPICall(
      usersTransaction,
      requestType.POST,
      {
        pageNumber: page,
        itemPerPage: 10,
        filter: filters,
      },
      {
        success: {
          show: false,
        },
        error: {
          show: true,
          message: 'Failed to retrieve user transactions',
        },
        info: {
          show: false,
        },
      },
    );

    if (data.success) {
      if (data.payload) {
        setTransactions(data.payload.transactions);
        setTotalPages(data.payload.totalPage);
      } else {
        setTransactions([]);
        setTotalPages(0);
      }
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: { toFilter: true, value },
    }));
  };

  return (
    <Box component="section">
      <Typography variant="subtitle1">Transactions</Typography>

      <TextField
        label="Description Filter"
        onChange={(e) =>
          handleFilterChange('descriptionFilter', e.target.value)
        }
      />
      {/* Add more filter inputs similarly based on your requirements */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Origin Bank ID</TableCell>
              <TableCell>Destination Bank ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              {/* Add more headers as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.originBankId}</TableCell>
                <TableCell>{transaction.destinationBankId}</TableCell>
                <TableCell>{transaction.originAmount}</TableCell>
                <TableCell>{transaction.state}</TableCell>
                {/* Add more cells as needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};
