import {
  convertToUserReadableDate,
  getUserId,
  isUserAdmin,
  performAPICall,
} from '@/libs/axios';
import {
  bankList,
  banksInfo,
  requestType,
  toogleCornRoute,
  usersTransaction,
} from '@/libs/endpionts';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid2,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

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

interface Bank {
  id: number;
  currency: Currency;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface BankInfo {
  balance: number;
  bank: Bank;
}

interface Filter {
  allTransactionFilter: {
    toFilter: boolean;
    value: boolean;
  };
  originBankIdFilter: {
    toFilter: boolean;
    value: number;
  };
  destinationIdFilter: {
    toFilter: boolean;
    value: number;
  };
  destinationBankIdFilter: {
    toFilter: boolean;
    value: number;
  };
  descriptionFilter: {
    toFilter: boolean;
    value: string;
  };
  currencyFilter: {
    toFilter: boolean;
    value: Array<Currency>;
  };
  dateFilter: {
    toFilter: boolean;
    value: {
      start: dayjs.Dayjs;
      end: dayjs.Dayjs;
    };
  };
  statusFilter: {
    toFilter: boolean;
    value: TransactionState;
  };
  typeFilter: {
    toFilter: boolean;
    value: TransactionType;
  };
  amountFilter: {
    toFilter: boolean;
    value: {
      start: number;
      end: number;
    };
  };
}

interface BankUser {
  banks: Bank[];
  users: User[];
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
      <UserFunctions />
      <BanksTable banks={userBankInfo} />
      <TransactionTable />
    </Container>
  );
}

const BanksTable = (props: { banks: BankInfo[] }) => {
  return (
    <Box component="section">
      <Typography variant="h6" gutterBottom>
        Account Info
      </Typography>
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
  const [filters, setFilters] = useState<Filter>({
    allTransactionFilter: { toFilter: false, value: true },
    originBankIdFilter: { toFilter: false, value: 0 },
    destinationIdFilter: { toFilter: false, value: 0 },
    destinationBankIdFilter: { toFilter: false, value: 0 },
    descriptionFilter: { toFilter: false, value: '' },
    currencyFilter: { toFilter: false, value: [Currency.INR] },
    dateFilter: {
      toFilter: false,
      value: { start: dayjs(), end: dayjs() },
    },
    statusFilter: { toFilter: false, value: TransactionState.SUCCESS },
    typeFilter: { toFilter: false, value: TransactionType.TRANSFER },
    amountFilter: { toFilter: false, value: { start: 0, end: 1000 } },
  });

  const [bankUserList, setBankUserList] = useState<BankUser>({
    banks: [],
    users: [],
  });

  const updateDestinationIdFilter = (value: number) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        destinationIdFilter: {
          ...oldValue['destinationIdFilter'],
          value: value,
        },
      };
    });
  };

  const updateOriginBankIdFilter = (value: number) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        originBankIdFilter: { ...oldValue['originBankIdFilter'], value: value },
      };
    });
  };

  const updateDestinationBankIdFilter = (value: number) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        destinationBankIdFilter: {
          ...oldValue['destinationBankIdFilter'],
          value: value,
        },
      };
    });
  };

  const udapteDescriptionFilter = (value: string) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        descriptionFilter: {
          ...oldValue['descriptionFilter'],
          value: value,
        },
      };
    });
  };

  const updateCurrencyFilter = (value: Currency[]) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        currencyFilter: {
          ...oldValue['currencyFilter'],
          value: value,
        },
      };
    });
  };

  const updateStatusFilter = (value: TransactionState) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        statusFilter: {
          ...oldValue['statusFilter'],
          value: value,
        },
      };
    });
  };

  const updateTypeFilter = (value: TransactionType) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        typeFilter: {
          ...oldValue['typeFilter'],
          value: value,
        },
      };
    });
  };

  const updateAmountStartFilter = (value: number) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        amountFilter: {
          ...oldValue['amountFilter'],
          value: {
            ...oldValue['amountFilter'].value,
            start: value,
          },
        },
      };
    });
  };

  const updateAmountEndFilter = (value: number) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        amountFilter: {
          ...oldValue['amountFilter'],
          value: {
            ...oldValue['amountFilter'].value,
            end: value,
          },
        },
      };
    });
  };

  const updateDateStartFilter = (value: dayjs.Dayjs) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        dateFilter: {
          ...oldValue['dateFilter'],
          value: {
            ...oldValue['dateFilter'].value,
            start: value,
          },
        },
      };
    });
  };

  const updateDateEndFilter = (value: dayjs.Dayjs) => {
    setFilters((oldValue) => {
      return {
        ...oldValue,
        dateFilter: {
          ...oldValue['dateFilter'],
          value: {
            ...oldValue['dateFilter'].value,
            end: value,
          },
        },
      };
    });
  };

  const toogleFilter = (key: keyof Filter) => {
    setFilters((value) => {
      return {
        ...value,
        [key]: { ...value[key], toFilter: !value[key].toFilter },
      };
    });
  };

  const fetchUserBankList = async () => {
    const data: {
      message?: string;
      payload?: {
        banks: Bank[];
        users: User[];
      };
      success: boolean;
    } = await performAPICall(
      bankList,
      requestType.GET,
      {},
      {
        success: {
          show: false,
        },
        error: {
          show: false,
        },
        info: {
          show: false,
        },
      },
    );
    if (data.success) {
      if (data.payload) {
        setBankUserList({
          banks: data.payload.banks,
          users: data.payload.users,
        });
      }
    }
  };

  const fetchTransactions = async (page: number, filters: Filter) => {
    let filterObject = filters;
    if (bankUserList.users.length > 0 && bankUserList.banks.length > 0) {
      filterObject = {
        ...filters,
        destinationIdFilter: {
          ...filters.destinationIdFilter,
          value: bankUserList.users[filters.destinationIdFilter.value].id,
        },
        destinationBankIdFilter: {
          ...filters.destinationBankIdFilter,
          value: bankUserList.banks[filters.destinationIdFilter.value].id,
        },
        originBankIdFilter: {
          ...filters.originBankIdFilter,
          value: bankUserList.banks[filters.originBankIdFilter.value].id,
        },
      };
    }
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
        filter: filterObject,
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
    fetchTransactions(page, filters);
    fetchUserBankList();
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

  return (
    <Box
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <Filter
        filters={filters}
        toogleFilter={toogleFilter}
        bankUser={bankUserList}
        updateDestinationIdFilter={updateDestinationIdFilter}
        updateOriginBankIdFilter={updateOriginBankIdFilter}
        updateDestinationBankIdFilter={updateDestinationBankIdFilter}
        udapteDescriptionFilter={udapteDescriptionFilter}
        updateCurrencyFilter={updateCurrencyFilter}
        updateStatusFilter={updateStatusFilter}
        updateTypeFilter={updateTypeFilter}
        updateAmountStartFilter={updateAmountStartFilter}
        updateAmountEndFilter={updateAmountEndFilter}
        updateDateStartFilter={updateDateStartFilter}
        updateDateEndFilter={updateDateEndFilter}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Origin User Id</TableCell>
              <TableCell>Origin Bank ID</TableCell>
              <TableCell>Origin Amount</TableCell>
              <TableCell>Destination User Id</TableCell>
              <TableCell>Destination Bank ID</TableCell>
              <TableCell>Desitnation Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.originId}</TableCell>
                <TableCell>{transaction.originBankId}</TableCell>
                <TableCell>
                  {transaction.originAmount} {transaction.originAmountCurrency}
                </TableCell>
                <TableCell>{transaction.destinationId}</TableCell>
                <TableCell>
                  {transaction.destinationBankId
                    ? transaction.destinationBankId
                    : '-'}
                </TableCell>
                <TableCell>
                  {transaction.destinationAmount}{' '}
                  {transaction.destinationAmountCurrency}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.state}</TableCell>
                <TableCell>
                  {convertToUserReadableDate(transaction.createdAt)}
                </TableCell>
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

const Filter = (props: {
  filters: Filter;
  bankUser: BankUser;
  toogleFilter: (key: keyof Filter) => void;
  updateDestinationIdFilter: (value: number) => void;
  updateOriginBankIdFilter: (value: number) => void;
  updateDestinationBankIdFilter: (value: number) => void;
  udapteDescriptionFilter: (value: string) => void;
  updateCurrencyFilter: (value: Currency[]) => void;
  updateStatusFilter: (value: TransactionState) => void;
  updateTypeFilter: (value: TransactionType) => void;
  updateAmountStartFilter: (value: number) => void;
  updateAmountEndFilter: (value: number) => void;
  updateDateStartFilter: (value: dayjs.Dayjs) => void;
  updateDateEndFilter: (value: dayjs.Dayjs) => void;
}) => {
  const handleToogleFilter = (key: keyof Filter) => {
    if (key === 'originBankIdFilter') {
      if (
        !props.filters.originBankIdFilter.toFilter &&
        !props.filters.originBankIdFilter.value
      ) {
        props.filters.originBankIdFilter.value = 0;
      }
      props.toogleFilter('originBankIdFilter');
    } else if (key === 'destinationBankIdFilter') {
      if (
        !props.filters.destinationBankIdFilter.toFilter &&
        !props.filters.destinationBankIdFilter.value
      ) {
        props.filters.destinationBankIdFilter.value = 0;
      }
      props.toogleFilter('destinationBankIdFilter');
    } else if (key === 'descriptionFilter') {
      if (
        !props.filters.descriptionFilter.toFilter &&
        !props.filters.descriptionFilter.value
      ) {
        props.filters.descriptionFilter.value = '';
      }
      props.toogleFilter('descriptionFilter');
    } else props.toogleFilter(key);
  };

  return (
    <Box p={3} bgcolor="background.paper" borderRadius={2} my={2}>
      <Typography variant="h6" gutterBottom>
        Transaction Filters
      </Typography>
      <Grid2 container spacing={2} justifyContent={'center'}>
        {isUserAdmin() && (
          <Box
            component="div"
            sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => {
                    handleToogleFilter('allTransactionFilter');
                  }}
                  checked={!props.filters.allTransactionFilter.toFilter}
                />
              }
              label="Get all transactions"
            />
          </Box>
        )}

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('destinationIdFilter');
                }}
                checked={props.filters.destinationIdFilter.toFilter}
              />
            }
            label="Filter by destination user"
          />
          <Select
            id="destination user"
            size="small"
            disabled={!props.filters.destinationIdFilter.toFilter}
            value={props.filters.destinationIdFilter.value}
            onChange={(e) => {
              const selectedValue = Number(e.target.value);
              props.updateDestinationIdFilter(selectedValue);
            }}
          >
            {Object.values(props.bankUser.users).map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.firstName} {item.lastName}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('originBankIdFilter');
                }}
                checked={props.filters.originBankIdFilter.toFilter}
              />
            }
            label="Filter by origin bank Id"
          />
          <Select
            id="origin bank id"
            size="small"
            disabled={!props.filters.originBankIdFilter.toFilter}
            value={props.filters.originBankIdFilter.value}
            onChange={(e: SelectChangeEvent<number>) => {
              const selectedValue = Number(e.target.value);
              props.updateOriginBankIdFilter(selectedValue);
            }}
          >
            {Object.values(props.bankUser.banks).map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.name} - {item.currency}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('destinationBankIdFilter');
                }}
                checked={props.filters.destinationBankIdFilter.toFilter}
              />
            }
            label="Filter by destination bank Id"
          />
          <Select
            id="destination bank id"
            size="small"
            disabled={!props.filters.destinationBankIdFilter.toFilter}
            value={props.filters.destinationBankIdFilter.value}
            onChange={(e: SelectChangeEvent<number>) => {
              const selectedValue = Number(e.target.value);
              props.updateDestinationBankIdFilter(selectedValue);
            }}
          >
            {Object.values(props.bankUser.banks).map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.name} - {item.currency}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('descriptionFilter');
                }}
                checked={props.filters.descriptionFilter.toFilter}
              />
            }
            label="Filter by description"
          />
          <TextField
            size="small"
            label="Description"
            variant="outlined"
            disabled={!props.filters.descriptionFilter.toFilter}
            onChange={(e) => {
              props.udapteDescriptionFilter(e.target.value);
            }}
          />
        </Box>

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('statusFilter');
                }}
                checked={props.filters.statusFilter.toFilter}
              />
            }
            label="Filter by status"
          />
          <Select
            id="transaction state"
            size="small"
            disabled={!props.filters.statusFilter.toFilter}
            value={props.filters.statusFilter.value}
            onChange={(e) => {
              const value: TransactionState = e.target
                .value as TransactionState;
              props.updateStatusFilter(value);
            }}
          >
            {Object.values(TransactionState).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('typeFilter');
                }}
                checked={props.filters.typeFilter.toFilter}
              />
            }
            label="Filter by Type"
          />
          <Select
            id="status select"
            size="small"
            disabled={!props.filters.typeFilter.toFilter}
            value={props.filters.typeFilter.value}
            onChange={(e) => {
              const value: TransactionType = e.target.value as TransactionType;
              props.updateTypeFilter(value);
            }}
          >
            {Object.values(TransactionType).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box
          component="div"
          sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('amountFilter');
                }}
                checked={props.filters.amountFilter.toFilter}
              />
            }
            label="Filter by amount"
          />
          <Box>
            <TextField
              disabled={!props.filters.amountFilter.toFilter}
              label="Start"
              variant="outlined"
              size="small"
              type="number"
              value={props.filters.amountFilter.value.start}
              onChange={(e) => {
                const value = Number(e.target.value);
                props.updateAmountStartFilter(value);
              }}
              inputProps={{ min: 0, max: props.filters.amountFilter.value.end }}
            />
            <TextField
              disabled={!props.filters.amountFilter.toFilter}
              label="End"
              variant="outlined"
              size="small"
              type="number"
              value={props.filters.amountFilter.value.end}
              onChange={(e) => {
                const value = Number(e.target.value);
                props.updateAmountEndFilter(value);
              }}
              inputProps={{ min: props.filters.amountFilter.value.start }}
            />
          </Box>
        </Box>

        <Box
          component="div"
          sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('dateFilter');
                }}
                checked={props.filters.dateFilter.toFilter}
              />
            }
            label="Filter by date"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DatePicker
                disabled={!props.filters.dateFilter.toFilter}
                label="Start Date"
                value={props.filters.dateFilter.value.start}
                onChange={(e) => {
                  const value: dayjs.Dayjs = e as dayjs.Dayjs;
                  props.updateDateStartFilter(value);
                }}
                maxDate={props.filters.dateFilter.value.end}
              />
              <DatePicker
                disabled={!props.filters.dateFilter.toFilter}
                label="End Date"
                value={props.filters.dateFilter.value.end}
                onChange={(e) => {
                  const value: dayjs.Dayjs = e as dayjs.Dayjs;
                  props.updateDateEndFilter(value);
                }}
                maxDate={dayjs()}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  handleToogleFilter('currencyFilter');
                }}
                checked={props.filters.currencyFilter.toFilter}
              />
            }
            label="Filter by currency"
          />
          <Select
            id="currency select"
            multiple
            size="small"
            disabled={!props.filters.currencyFilter.toFilter}
            value={props.filters.currencyFilter.value}
            onChange={(e) => {
              const value: Currency[] = e.target.value as Currency[];
              props.updateCurrencyFilter(value);
            }}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {Object.values(Currency).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid2>
    </Box>
  );
};

const UserFunctions = () => {
  const [cornJobRunning, setCornJobStatus] = useState(false);
  const toogleCornJob = async () => {
    const data: { success: boolean; message?: string; payload: boolean } =
      await performAPICall(
        toogleCornRoute,
        requestType.GET,
        {},
        {
          success: {
            show: true,
            message: cornJobRunning ? 'Corn job stopped' : 'Corn job started',
          },
          error: {
            show: true,
            message: cornJobRunning
              ? 'Unable to stop corn job'
              : 'Unable to start corn job',
          },
          info: {
            show: false,
          },
        },
      );

    if (data.success) {
      setCornJobStatus(data.payload);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Functions
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {isUserAdmin() && (
          <Button variant="contained" color="primary" onClick={toogleCornJob}>
            {cornJobRunning ? 'Stop Corn Job' : 'Start Corn Job'}
          </Button>
        )}
        <Button variant="contained" color="primary">
          Transfer Money
        </Button>
        <Button variant="contained" color="primary">
          Widthraw Money
        </Button>
      </Box>
    </Box>
  );
};

type Transfer = {
  originBankId: number;
  destinationUserId: number;
  destinationBankId: number;
  amount: number;
  description: string;
};

// const TransferMoneyModal = (props: {
//   open: boolean;
//   bankUser: BankUser,
//   onClose: () => void;
//   onTransfer: (value: Transfer) => void;
// }) => {
//   const [transferData, setTransferData] = useState<Transfer>({
//     originBankId: getUserId()!,
//     destinationUserId: 0,
//     destinationBankId: 0,
//     amount: 1,
//     description: '',
//   });

//   const handleChange = (
//     e:
//       | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//       | SelectChangeEvent,
//   ) => {
//     const { name, value } = e.target;
//     setTransferData({
//       ...transferData,
//       [name]: value,
//     });
//   };

//   const handleTransfer = () => {
//     props.onTransfer(transferData);
//     props.onClose();
//   };

//   return (
//     <Dialog open={props.open} onClose={props.onClose}>
//       <DialogTitle>Transfer Money</DialogTitle>
//       <DialogContent>
//         <Select
//           id="destination user"
//           size="small"
//           value={props.bankUser.users}
//           onChange={(e) => {
//             const selectedValue = Number(e.target.value);
//             props.updateDestinationIdFilter(selectedValue);
//           }}
//         >
//           {Object.values(props.bankUser.users).map((item, idx) => (
//             <MenuItem key={idx} value={idx}>
//               {item.firstName} {item.lastName}
//             </MenuItem>
//           ))}
//         </Select>
//         <FormControl fullWidth margin="normal">
//           <TextField
//             label="Amount"
//             name="amount"
//             type="number"
//             value={transferData.amount}
//             onChange={handleChange}
//             required
//           />
//         </FormControl>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Currency</InputLabel>
//           <Select
//             name="currency"
//             value={transferData.currency}
//             onChange={handleChange}
//           >
//             <MenuItem value="USD">USD</MenuItem>
//             <MenuItem value="EUR">EUR</MenuItem>
//             <MenuItem value="INR">INR</MenuItem>
//             <MenuItem value="JPY">JPY</MenuItem>
//             <MenuItem value="CNY">CNY</MenuItem>
//           </Select>
//         </FormControl>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={handleTransfer} color="primary" variant="contained">
//           Transfer
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
