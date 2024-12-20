import { useSelector } from 'react-redux';
import { RestrictedPage } from '../RestrictedPage';
import { DashboardLayout } from '../../template/DashboardLayout';
import { AnimatedView } from '../../components/common/AnimatedElements/AnimatedView';
import './checkout-page.styles.scss';
import { CustomInput } from '../../components/common/CustomInput/CustomInput';
import React, { useState } from 'react';
import { CreditCard } from '../../components/CreditCard/CreditCard';
import { checkout } from '../../services/transactionService';
import { useDevice } from '../../hooks/useDevice';
import { PayBtn } from '../../components/PayBtn/PayBtn';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { IntermediateLoader } from '../../components/common/Loader/IntermediateLoader';
import { CustomSnackbar } from '../../components/common/CustomSnackbar/CustomSnackbar';
import { snackbarType, useSnackbar } from '../../hooks/useSnackbar';

export const CheckoutPage = () => {
  const accountStore = useSelector((state) => state.account);
  const { initSession } = useAuth();
  const { showSnackbar, hideSnackbar } = useSnackbar();
  const { width } = useDevice();

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!accountStore.authenticated) {
    return <RestrictedPage />;
  }

  if (localStorage.getItem('redirection') === '/payment/success') {
    return <Navigate to={'/payment/success'} />;
  }

  if (!accountStore.cart?.cartItems?.length) {
    return <Navigate to={'/productos'} />;
  }

  if (accountStore.accountInfo.kycStatus !== 'COMPLETED_KYC') {
    return <Navigate to="/kyc" />;
  }

  const handleCardNumberChange = (number) => {
    if (number.length > 16) {
      return;
    }
    setCardNumber(number);
  };

  const handleExpirationDateChange = (newValue) => {
    const sanitizedValue = newValue.replace(/[^0-9]/g, '');

    if (sanitizedValue.length > 4) return;

    const formattedValue =
      sanitizedValue.length >= 3
        ? `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(2, 4)}`
        : sanitizedValue;

    setExpirationDate(formattedValue);
  };

  const handleCvvChange = (number) => {
    if (number.length > 3) {
      return;
    }
    setCvv(number);
  };

  const handleCheckout = async () => {
    if (
      cardNumber.length !== 16 ||
      !cardNumber ||
      expirationDate.length !== 5 ||
      cvv.length !== 3
    ) {
      showSnackbar('Por favor completá todos los datos', snackbarType.error);
      return;
    }

    setIsLoading(true);

    try {
      await checkout();
      localStorage.setItem('redirection', '/payment/success');
      await initSession();
    } catch (err) {
      showSnackbar(err?.error ?? 'Ocurrió un error al realizar la compra', snackbarType.error);
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <CustomSnackbar />
      <IntermediateLoader open={isLoading} />
      <AnimatedView orientation="horizontal">
        <>
          <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Realizar pago</h1>
          <div className="checkout-page">
            <div className="left-container">
              <CustomInput
                value={cardNumber}
                type="number"
                onChange={handleCardNumberChange}
                label="Número de tarjeta"
              />
              <CustomInput value={cardName} onChange={setCardName} label="Nombre y apellido" />
              <CustomInput
                value={expirationDate}
                onChange={handleExpirationDateChange}
                label="Fecha de vencimiento"
              />
              <CustomInput
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                label="Código de seguridad"
              />

              {width <= 1000 && <PayBtn handleCheckout={handleCheckout} />}
            </div>
            <div className="right-container">
              <CreditCard
                cardNumber={cardNumber}
                cardName={cardName}
                expirationDate={expirationDate}
              />

              {width > 1000 && <PayBtn handleCheckout={handleCheckout} />}
            </div>
          </div>
        </>
      </AnimatedView>
    </DashboardLayout>
  );
};
