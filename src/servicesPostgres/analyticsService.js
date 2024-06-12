const pool = require("../../databasePg");
const logger = require("../utils/logger");

exports.calculateTotalRenevueFromOrder = async () => {
  try {
    const query = `
      SELECT
        p.product_type,
        SUM((cart_item ->> 'quantity')::INT * p.price) AS total_renevue
      FROM 
        orders o
      JOIN 
        carts c ON c.cart_id = o.cart_id
      CROSS JOIN LATERAL jsonb_array_elements(c.cart_items) AS cart_item     
      JOIN  
        products p ON (cart_item ->> 'product_id')::INT = p.product_id
      WHERE 
        EXTRACT(MONTH FROM order_date) >= EXTRACT(MONTH FROM CURRENT_DATE) - 1
        AND EXTRACT(MONTH FROM order_date) < EXTRACT(MONTH FROM CURRENT_DATE)
      GROUP BY 
        p.product_type;
    `;
    const analyzedData = (await pool.query(query)).rows;
    logger.info("Calculated total renevue from orders");
    return analyzedData;
  } catch (error) {
    logger.error(error, "Error occured while calculating total renevue");
    throw error;
  }
};

exports.compareSalesPerfomanceOfProducts = async () => {
  try {
    const query = `
      WITH current_year_sales AS (
        SELECT 
          p.product_id,
          SUM((cart_item ->> 'quantity')::INT * p.price) AS current_year_sales
        FROM 
          orders o
        JOIN 
          carts c ON c.cart_id = o.cart_id
        CROSS JOIN LATERAL jsonb_array_elements(c.cart_items) AS cart_item     
        JOIN  
          products p ON (cart_item ->> 'product_id')::INT = p.product_id
          WHERE 
              EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
          GROUP BY 
              p.product_id
      ),
      previous_year_sales AS (
          SELECT 
          p.product_id,
          SUM((cart_item ->> 'quantity')::INT * p.price) AS previous_year_sales
        FROM 
          orders o
        JOIN 
          carts c ON c.cart_id = o.cart_id
        CROSS JOIN LATERAL jsonb_array_elements(c.cart_items) AS cart_item     
        JOIN  
          products p ON (cart_item ->> 'product_id')::INT = p.product_id
          WHERE 
              EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
          GROUP BY 
              p.product_id
      )
      SELECT 
          c.product_id,
          c.current_year_sales,
          p.previous_year_sales,
          (c.current_year_sales - p.previous_year_sales) / p.previous_year_sales AS sales_percentage_change
      FROM 
          current_year_sales c
      JOIN 
          previous_year_sales p ON c.product_id = p.product_id;
    `;
    const analyzedData = (await pool.query(query)).rows;
    logger.info("compared sales performance of products");
    return analyzedData;
  } catch (error) {
    logger.error(error, "Error occured while comparing sales performance of products");
    throw error;
  }
};

// CREATED two trigger of abandoned_status and last_activity_time for this
exports.frequancyAndReasonForAbandonedCart = async () => {
  try {
    const query = `
      SELECT 
          cart_item ->> 'product_id' as product_id,
        SUM((cart_item ->> 'quantity')::INT) AS abandoned_count
      FROM 
        carts
      CROSS JOIN LATERAL jsonb_array_elements(cart_items) AS cart_item
      WHERE abandoned = true
      GROUP BY 
        cart_item ->> 'product_id';
    `;
    const analyzedData = (await pool.query(query)).rows;
    return analyzedData;
  } catch (error) {
    logger.error(error, "Error occured while analyzing data");
    throw error;
  }
};

exports.calculateSalesPerformanceInRegions = async () => {
  try {
    const query = `
      SELECT 
        o.region,
        p.product_type,
        SUM((cart_item ->> 'quantity')::INT * p.price) AS total_renevue
      FROM 
        orders o
      JOIN 
        carts c ON c.cart_id = o.cart_id
      CROSS JOIN LATERAL jsonb_array_elements(c.cart_items) AS cart_item     
      JOIN  
        products p ON (cart_item ->> 'product_id')::INT = p.product_id
      WHERE 
        EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY 
        o.region, 
        p.product_type
      order by 
        o.region;
    `;
    const analyzedData = (await pool.query(query)).rows;
    logger.info("Calculated sales performance in different regions");
    return analyzedData;
  } catch (error) {
    logger.error(
      error,
      "Error occured while calculating sales performance of products in different regions",
    );
    throw error;
  }
};
